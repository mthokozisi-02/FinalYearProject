<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use App\Models\UserPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    public function processPayment(Request $request)
    {
        try {
            $request->validate([
                'user_package_id' => 'required|exists:user_packages,id',
                // 'payment_method' => 'required|string',
                'status' => 'required',
                'amount' => 'required|numeric',
            ]);

            $userPackage = UserPackage::with('package', 'subscriptions')->find($request->user_package_id);

            if (!$userPackage) {
                return errorResponseHandler('Invalid package selection.');
            }

            DB::beginTransaction();

            // Process payment (dummy logic here, replace with actual payment gateway integration)
            $payment = Payment::create([
                // 'user_id' => $userPackage->user_id,
                'amount' => $request->amount,
                'payment_method' => 'paypal',    
                'transaction_id' => $request->order_id,
                'status' => $request->status
            ]);

            if ($payment->status !== 'COMPLETED') {
                return errorResponseHandler('Payment failed. Please try again.');
            }

            // Create a subscription only if the payment is successful
            $subscription = Subscription::create([
                'user_package_id' => $userPackage->id,
                'start_date' => now(),
                'end_date' => now()->addMonth(), // Or yearly based on the package duration
                'status' => 'active',
            ]);

            $payment->update([
                'subscription_id' => $subscription->id
            ]);

            // $userPackage->load('package', 'subscriptions');

            DB::commit();

            return successResponseHandler('Payment successful. Subscription activated.', [
                'payment' => $payment,
                'subscription' => $userPackage,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return errorResponseHandler($e->getMessage());
        }
    }

}
