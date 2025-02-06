<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Models\SubOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PayoutsController extends Controller
{
    public function getSellersWithBalances()
    {
        $sellers = SubOrder::where('status', 'paid')
            ->where('payout_status', 'pending')
            ->groupBy('seller_id')
            ->select(
                'seller_id',
                DB::raw('SUM(payable_amount) as balance')
            )
            ->with('seller:id,name,email') // Assuming `SubOrder` has a `seller` relationship
            ->orderByDesc('balance') // Optional: order by balance
            ->get();

        if ($sellers->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'No sellers found with pending balances.',
                'data' => [],
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $sellers,
        ]);
    }

    public function getPayouts(Request $request)
    {
        try {
            // Get status from query params if not provided as a route parameter
            $status = $request->query('status', null);

            $query = Payout::with('seller')->latest();

            if ($status) {
                $query->where('status', $status);
            }

            $payouts = $query->get();

            return successResponseHandler("Fetched payouts successfully", $payouts);
            
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }


    public function makePayouts()
    {
        // Step 1: Fetch eligible sellers and their total payout amounts
        $eligibleSellers = SubOrder::join('bank_details', 'sub_orders.seller_id', '=', 'bank_details.user_id')
            ->select(
                'sub_orders.seller_id',
                'bank_details.paypal_email',
                DB::raw('SUM(sub_orders.payable_amount) as total_payout')
            )
            ->where('sub_orders.payout_status', 'pending')
            ->groupBy('sub_orders.seller_id', 'bank_details.paypal_email')
            ->get();

        if ($eligibleSellers->isEmpty()) {
            return response()->json(['message' => 'No payouts to process'], 200);
        }

        // Step 2: Configure PayPal Client
        $paypal = new PayPalClient();
        $paypal->setApiCredentials(config('paypal'));
        $accessToken = $paypal->getAccessToken();
        $paypal->setAccessToken($accessToken);

        $payoutBatch = [];

        // Step 3: Prepare Payout Batch
        foreach ($eligibleSellers as $seller) {
            // Calculate 3% commission
            $commission_amount = $seller->total_payout * 0.03; // 3% of total payout
            $amount_after_commission = $seller->total_payout - $commission_amount;

            // Validate PayPal email format
            if (!filter_var($seller->paypal_email, FILTER_VALIDATE_EMAIL)) {
                Log::error("Invalid PayPal email for Seller ID: {$seller->seller_id}, Email: {$seller->paypal_email}");
                continue; // Skip this seller and move to the next
            }

            $payoutBatch[] = [
                'recipient_type' => 'EMAIL',
                'receiver' => $seller->paypal_email,
                'amount' => [
                    'value' => number_format($amount_after_commission, 2, '.', ''),
                    'currency' => 'USD'
                ],
                'note' => 'Seller payout after 3% commission deduction',
                'sender_item_id' => uniqid('seller_' . $seller->seller_id . '_')
            ];
        }

        if (empty($payoutBatch)) {
            return response()->json(['message' => 'No valid payouts to process'], 400);
        }

        // Step 4: Call PayPal Payouts API
        try {
            $response = $paypal->createBatchPayout([
                'sender_batch_header' => [
                    'sender_batch_id' => uniqid('batch_'),
                    'email_subject' => 'You have received a payout!',
                    'email_message' => 'You have received a payout for your sales on our platform.'
                ],
                'items' => $payoutBatch,
            ]);

            // Step 5: Process PayPal Response
            if (in_array($response['batch_header']['batch_status'], ['PENDING', 'SUCCESS'])) {
                foreach ($response['items'] as $item) {
                    $sellerId = explode('_', $item['sender_item_id'])[1]; // Extract seller ID from sender_item_id
                    
                    if ($item['transaction_status'] === 'SUCCESS') {
                        // Update successful payout
                        SubOrder::where('seller_id', $sellerId)
                            ->where('payout_status', 'pending')
                            ->update([
                                'payout_status' => 'paid',
                                'payout_date' => now(),
                            ]);

                        Payout::create([
                            'seller_id' => $sellerId,
                            'amount' => $item['amount']['value'],
                            'transaction_id' => $response['batch_header']['payout_batch_id'],
                            'status' => 'completed',
                        ]);

                    } elseif ($item['transaction_status'] === 'FAILED') {
                        // Log failed payouts
                        Log::error("Payout failed for Seller ID: {$sellerId}, Reason: " . $item['errors']['message']);

                        Payout::create([
                            'seller_id' => $sellerId,
                            'amount' => $item['amount']['value'],
                            'transaction_id' => $response['batch_header']['payout_batch_id'],
                            'status' => 'failed',
                            'error_message' => $item['errors']['message'],
                        ]);
                    }
                }

                return response()->json(['message' => 'Payouts processed successfully'], 200);
            } else {
                throw new \Exception('Payout batch status: ' . $response['batch_header']['batch_status']);
            }
        } catch (\Exception $e) {
            Log::error('Payout Error: ' . $e->getMessage());
            return response()->json(['message' => 'Payouts failed', 'error' => $e->getMessage()], 500);
        }
    }

    // public function makePayouts()
    // {
    //     // Step 1: Fetch eligible sellers and their total payout amounts
    //     $eligibleSellers = SubOrder::join('bank_details', 'sub_orders.seller_id', '=', 'bank_details.user_id')
    //         ->select(
    //             'sub_orders.seller_id',
    //             'bank_details.paypal_email',
    //             DB::raw('SUM(sub_orders.payable_amount) as total_payout')
    //         )
    //         ->where('sub_orders.payout_status', 'pending')
    //         ->groupBy('sub_orders.seller_id', 'bank_details.paypal_email')
    //         ->get();

    //     if ($eligibleSellers->isEmpty()) {
    //         return response()->json(['message' => 'No payouts to process'], 200);
    //     }

    //     // Step 2: Configure PayPal Client
    //     $paypal = new PayPalClient();
    //     $paypal->setApiCredentials(config('paypal'));
    //     $accessToken = $paypal->getAccessToken();
    //     $paypal->setAccessToken($accessToken);

    //     $payoutBatch = [];

    //     // Step 3: Prepare Payout Batch
    //     foreach ($eligibleSellers as $seller) {
    //         $payoutBatch[] = [
    //             'recipient_type' => 'EMAIL',
    //             'receiver' => $seller->paypal_email,
    //             'amount' => [
    //                 'value' => number_format($seller->total_payout, 2, '.', ''),
    //                 'currency' => 'USD' // Adjust this based on your business currency
    //             ],
    //             'note' => 'Seller payout',
    //             'sender_item_id' => uniqid('seller_' . $seller->seller_id . '_') // Unique identifier for each payout
    //         ];
    //     }

    //     // Step 4: Call PayPal Payouts API
    //     try {
    //         $response = $paypal->createBatchPayout([
    //             'sender_batch_header' => [
    //                 'sender_batch_id' => uniqid('batch_'),
    //                 'email_subject' => 'You have received a payout!',
    //                 'email_message' => 'You have received a payout for your sales on our platform.'
    //             ],
    //             'items' => $payoutBatch,
    //         ]);

    //         // Step 5: Process Successful Payouts
    //         if ($response['batch_header']['batch_status'] === 'PENDING' || $response['batch_header']['batch_status'] === 'SUCCESS') {
    //             foreach ($eligibleSellers as $seller) {
    //                 // Mark related sub_orders as paid
    //                 SubOrder::where('seller_id', $seller->seller_id)
    //                     ->where('payout_status', 'pending')
    //                     ->update([
    //                         'payout_status' => 'paid',
    //                         'payout_date' => now(),
    //                     ]);

    //                 // Log payout in the payouts table
    //                 Payout::create([
    //                     'seller_id' => $seller->seller_id,
    //                     'amount' => $seller->total_payout,
    //                     'transaction_id' => $response['batch_header']['payout_batch_id'],
    //                     'status' => 'completed',
    //                 ]);
    //             }

    //             return response()->json(['message' => 'Payouts processed successfully'], 200);
    //         } else {
    //             throw new \Exception('Payout batch status: ' . $response['batch_header']['batch_status']);
    //         }
    //     } catch (\Exception $e) {
    //         // Step 6: Handle Errors
    //         Log::error('Payout Error: ' . $e->getMessage());
    //         return response()->json(['message' => 'Payouts failed', 'error' => $e->getMessage()], 500);
    //     }
    // }
}
