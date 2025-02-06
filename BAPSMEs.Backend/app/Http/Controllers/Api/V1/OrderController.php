<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\SubOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function __construct(public PaymentController $paymentController)
    {
        $this->paymentController = $paymentController;
    }

        /**
     * Get a list of orders.
     */
    public function index()
    {
        try {
            $orders = Order::with('products')->where('user_id', auth()->id())->get();
            return successResponseHandler('fetched orders successfully', $orders);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function getAllOrders()
    {
        try {
            // Retrieve all orders with their sub-orders and products
            $orders = Order::with([
                'subOrders' => function ($query) {
                    $query->with(['buyer', 'seller', 'orderProducts.product']);
                }
            ])->latest()->get();

            return successResponseHandler('Orders retrieved successfully.', $orders);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function showBuyerOrder($orderId)
    {
        // $order = Order::with('subOrders.products')->findOrFail($orderId);
        $order = Order::with('products')->findOrFail($orderId);

        // Aggregate all products across sub-orders
        // $products = $order->subOrders->flatMap(function ($subOrder) {
        //     return $subOrder->products->map(function ($product) use ($subOrder) {
        //         return [
        //             'id' => $product->id,
        //             'name' => $product->name,
        //             'quantity' => $product->pivot->quantity,
        //             'price' => $product->pivot->price,
        //             'seller_id' => $subOrder->seller_id,
        //             'seller_name' => $subOrder->seller->name,
        //         ];
        //     });
        // });

        // $response = [
        //     'order_id' => $order->id,
        //     'total_price' => $order->total_price,
        //     'status' => $order->status,
        //     'products' => $products,
        // ];

        return successResponseHandler('Order details fetched successfully', $order);
    }

    /**
     * Get a specific order.
     */
    public function show($id)
    {
        try {
            $order = Order::with('products')->where('id', $id)->where('user_id', auth()->id())->first();

            if (!$order) {
                return notFoundResponseHandler('Order not found');
            }

            return successResponseHandler('order fetched successfully', $order);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function showAllSellerSubOrders()
    {
        try {
            // Fetch all sub-orders for the logged-in seller
            $subOrders = SubOrder::with('products')
                ->where('seller_id', auth()->id())
                ->get();

            return successResponseHandler('Sub-orders fetched successfully', $subOrders);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function showAllSubOrders()
    {
        try {
            // Fetch all sub-orders for the logged-in seller
            $subOrders = SubOrder::with('products')
                ->get();

            return successResponseHandler('Sub-orders fetched successfully', $subOrders);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }


    public function showSellerOrder($subOrderId)
    {
        try {
            $subOrder = SubOrder::with('products')->where('seller_id', auth()->id())->findOrFail($subOrderId);

            return successResponseHandler('Sub-order details fetched successfully', $subOrder);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'order_id' => 'required',
            'amount' => 'required',
            'status' => 'required',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1'
        ]);

        $user = auth()->user();
        $productsGroupedBySeller = [];

        DB::beginTransaction();

        try {
            foreach ($validatedData['products'] as $productData) {
                $product = Product::find($productData['id']);

                // Check if requested quantity is more than available stock
                if ($productData['quantity'] > $product->quantity) {
                    return errorResponseHandler("Requested quantity for {$product->name} exceeds available stock.");
                }

                // Reduce stock quantity
                $product->decrement('quantity', $productData['quantity']);

                $productsGroupedBySeller[$product->user_id][] = [
                    'id' => $product->id,
                    'price' => $product->price,
                    'quantity' => $productData['quantity']
                ];
            }

            // Create the main order
            $mainOrder = Order::create([
                'user_id' => $user->id,
                'total_price' => 0, // Will be updated later
                'status' => 'pending'
            ]);

            $totalOrderPrice = 0;

            foreach ($productsGroupedBySeller as $sellerId => $products) {
                $subOrderPrice = 0;

                foreach ($products as $product) {
                    $subOrderPrice += $product['price'] * $product['quantity'];
                }

                // Create a sub-order for the seller
                $subOrder = SubOrder::create([
                    'order_id' => $mainOrder->id,
                    'buyer_id' => $user->id,
                    'seller_id' => $sellerId,
                    'total_price' => $subOrderPrice,
                    'payable_amount' => $subOrderPrice,
                    'status' => 'pending'
                ]);

                // Attach products to the sub-order
                foreach ($products as $product) {
                    $subOrder->products()->attach($product['id'], [
                        'order_id' => $mainOrder->id,
                        'quantity' => $product['quantity'],
                        'price' => $product['price'],
                    ]);
                }

                $totalOrderPrice += $subOrderPrice;
            }

            // Update the total price of the main order
            $mainOrder->update(['total_price' => $validatedData['amount']]);

            $payment = $this->createPayment($request, $mainOrder);

            DB::commit();

            return createdResponseHandler('Order created successfully', [
                $mainOrder->load('subOrders.products'),
                $payment
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return errorResponseHandler($e->getMessage());
        }
    }


    /**
     * Create a new order.
     */
    // public function store(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'order_id' => 'required',
    //         'amount' => 'required',
    //         'status' => 'required',
    //         'products' => 'required|array',
    //         'products.*.id' => 'required|exists:products,id',
    //         'products.*.quantity' => 'required|integer|min:1'
    //     ]);

    //     $user = auth()->user();

    //     // Group products by seller
    //     $productsGroupedBySeller = [];
    //     foreach ($validatedData['products'] as $productData) {
    //         $product = Product::find($productData['id']);
    //         $productsGroupedBySeller[$product->user_id][] = [
    //             'id' => $product->id,
    //             'price' => $product->price,
    //             'quantity' => $productData['quantity']
    //         ];
    //     }

    //     DB::beginTransaction();

    //         // Create the main order
    //         $mainOrder = Order::create([
    //             'user_id' => $user->id,
    //             'total_price' => 0, // Will be updated later
    //             'status' => 'pending'
    //         ]);

    //         $totalOrderPrice = 0;

    //         foreach ($productsGroupedBySeller as $sellerId => $products) {
    //             $subOrderPrice = 0;

    //             // Calculate total price for this seller's products
    //             foreach ($products as $product) {
    //                 $subOrderPrice += $product['price'] * $product['quantity'];
    //             }

    //             // Create a sub-order for the seller
    //             $subOrder = SubOrder::create([
    //                 'order_id' => $mainOrder->id,
    //                 'buyer_id' => $user->id,
    //                 'seller_id' => $sellerId,
    //                 'total_price' => $subOrderPrice,
    //                 'payable_amount' => $subOrderPrice,
    //                 'status' => 'pending'
    //             ]);

    //             // Attach products to the sub-order
    //             foreach ($products as $product) {
    //                 $subOrder->products()->attach($product['id'], [
    //                     'order_id' => $mainOrder->id,
    //                     'quantity' => $product['quantity'],
    //                     'price' => $product['price'],
    //                 ]);
    //             }

    //             $totalOrderPrice += $subOrderPrice;
    //         }

    //         // Update the total price of the main order
    //         // $mainOrder->update(['total_price' => $totalOrderPrice]);
    //         $mainOrder->update(['total_price' => $validatedData['amount']]);

    //         // $payment = $this->paymentController->createOrder($request, $mainOrder);
    //         $payment = $this->createPayment($request, $mainOrder);

    //         // Log::info("=================== Payment ===================");
    //         // Log::info(" ",$payment);

    //         DB::commit();

    //         return createdResponseHandler('Order created successfully', [
    //             $mainOrder->load('subOrders.products'),
    //             $payment
    //         ]);
    // }

    private function createPayment(Request $request, $order)
    {
        $user = auth()->user();

        $paymentDetails = Payment::create([
            'buyer_id' => $user->id,
            'order_id' => $order->id,
            'amount' => $order->total_price,
            'payment_method' => "paypal",
            'transaction_id' => $request->order_id,
            'status' => $request->status
        ]);

        return $paymentDetails;
    }

    public function updateOrderStatus($order_id)
    {
        try {
            // $validated = $request->validate([
            //     'order_id' => 'required|integer|exists:orders,id',
            // ]);

            // Find the order by ID and check its current status
            $order = Order::where('id', $order_id)
                ->where('status', 'complete') // Ensure it's 'complete'
                ->first();

            if (!$order) {
                return notFoundResponseHandler('Order not found or not in a complete status.');
            }

            // Update the order status to 'delivered'
            $order->status = 'delivered';
            $order->save();

            // Update all related sub_orders to mark them ready for payouts
            SubOrder::where('order_id', $order->id)
                ->update([
                    'payout_status' => 'pending',
                ]);

            return successResponseHandler('Order status updated to delivered and sub-orders are ready for payouts.', $order);

            // return response()->json(['message' => 'Order status updated to delivered and sub-orders are ready for payouts.']);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    // public function store(Request $request)
    // {
    //     try {
    //         $validatedData = $request->validate([
    //             'products' => 'required|array',
    //             'products.*.id' => 'required|exists:products,id',
    //             'products.*.quantity' => 'required|integer|min:1'
    //         ]);

    //         $user = auth()->user();

    //         // Group products by seller
    //         $productsGroupedBySeller = [];
    //         foreach ($validatedData['products'] as $productData) {
    //             $product = Product::find($productData['id']);
    //             $productsGroupedBySeller[$product->user_id][] = [
    //                 'id' => $product->id,
    //                 'price' => $product->price,
    //                 'quantity' => $productData['quantity']
    //             ];
    //         }

    //         DB::beginTransaction();

    //         // Create the main order
    //         $mainOrder = Order::create([
    //             'user_id' => $user->id,
    //             'total_price' => 0, // Will be updated later
    //             'status' => 'pending'
    //         ]);

    //         $totalOrderPrice = 0;

    //         foreach ($productsGroupedBySeller as $sellerId => $products) {
    //             $subOrderPrice = 0;

    //             // Calculate total price for this seller's products
    //             foreach ($products as $product) {
    //                 $subOrderPrice += $product['price'] * $product['quantity'];
    //             }

    //             // Create a sub-order for the seller
    //             $subOrder = SubOrder::create([
    //                 'order_id' => $mainOrder->id,
    //                 'buyer_id' => $user->id,
    //                 'seller_id' => $sellerId,
    //                 'total_price' => $subOrderPrice,
    //                 'status' => 'pending'
    //             ]);

    //             // Attach products to the sub-order
    //             foreach ($products as $product) {
    //                 $subOrder->products()->attach($product['id'], [
    //                     'order_id' => $mainOrder->id,
    //                     'quantity' => $product['quantity'],
    //                     'price' => $product['price'],
    //                 ]);
    //             }

    //             $totalOrderPrice += $subOrderPrice;
    //         }

    //         // Update the total price of the main order
    //         $mainOrder->update(['total_price' => $totalOrderPrice]);

    //         $payment = $this->paymentController->createOrder($request, $mainOrder);

    //         Log::info("=================== Payment ===================");
    //         Log::info(" ",$payment);

    //         DB::commit();

    //         return createdResponseHandler('Order created successfully', [
    //             $mainOrder->load('subOrders.products'),
    //             $payment
    //         ]);

    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return errorResponseHandler($e->getMessage());
    //     }
    // }


    public function getOrdersForSeller($sellerId)
    {
        try {
            $orders = Order::with('products')
                ->where('seller_id', $sellerId) // Filter by seller_id
                ->get();

            return successResponseHandler('fetched oders for seller', $orders);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function getPendingOrdersForSeller($sellerId)
    {
        try {
            $orders = Order::with('products')
                ->where('seller_id', $sellerId)
                ->where('status', 'pending')
                ->get();

            return successResponseHandler('fetched pending seller orders', $orders);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function getDeliveredOrdersForSeller($sellerId)
    {
        try {
            $orders = Order::with('products')
                ->where('seller_id', $sellerId)
                ->where('status', 'delivered')
                ->get();

            return successResponseHandler('fetched all delivered orders for seller', $orders);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function getCanceledOrdersForSeller($sellerId)
    {
        try {
            $orders = Order::with('products')
                ->where('seller_id', $sellerId)
                ->where('status', 'canceled')
                ->get();

            return successResponseHandler('fetched all canceled orders for seller', $orders);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    /**
     * Update the status of an order.
     */
    public function update(Request $request, $id)
    {
        try {
            $user = auth()->user(); // Get the authenticated user

            $order = Order::where('id', $id)
                ->where('seller_id', $user->id)
                ->first();

            if (!$order) {
                return response()->json(['error' => 'Order not found or access denied'], 404);
            }

            $validatedData = $request->validate([
                'status' => 'required|in:pending,delivered,canceled',
            ]);

            $order->update($validatedData);

            return successResponseHandler('Order updated successfully', $order);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    /**
     * Delete an order.
     */
    public function destroy($id)
    {
        try {
            $user = auth()->user(); // Get the authenticated user

            $order = Order::where('id', $id)
                ->where('seller_id', $user->id())
                ->first();

            if (!$order) {
                return notFoundResponseHandler('Order not found or access denied');
            }

            $order->delete();

            return deletedResponseHandler('Order deleted successfully');

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }
}
