<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Order;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Get a list of orders.
     */
    public function index()
    {
        try {
            $bookings = Booking::with(['product','seller','subCategory','user'])->where('user_id', auth()->id())->get();
            return successResponseHandler('fetched bookings successfully', $bookings);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function getAllBookings()
    {
        try {
            // Retrieve all bookings with their sub-orders and products
            $bookings = Booking::with(['product','seller','subCategory','user'])->latest()->get();

            return successResponseHandler('Bookings retrieved successfully.', $bookings);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function showBuyerBooking($bookingId)
    {
        // $booking = Order::with('subOrders.products')->findOrFail($bookingId);
        $booking = Booking::with(['product','seller','subCategory','user'])->findOrFail($bookingId);

        // Aggregate all products across sub-orders
        // $products = $booking->subOrders->flatMap(function ($subOrder) {
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
        //     'order_id' => $booking->id,
        //     'total_price' => $booking->total_price,
        //     'status' => $booking->status,
        //     'products' => $products,
        // ];

        return successResponseHandler('Booking details fetched successfully', $booking);
    }

    /**
     * Get a specific order.
     */
    public function show($id)
    {
        try {
            $booking = Booking::with(['product','seller','subCategory','user'])->where('id', $id)->where('user_id', auth()->id())->first();

            if (!$booking) {
                return notFoundResponseHandler('Booking not found');
            }

            return successResponseHandler('Booking fetched successfully', $booking);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'seller_id' => 'required',
                'product_id' => 'required',
                'sub_category_id' => 'required',
                'user_id' => 'required',
                'total_price' => 'required',
                'quantity' => 'nullable',
                'location' => 'nullable|string|max:255',
                'payment' => 'nullable|string|max:255',
                'message' => 'nullable|string|max:255',
                'date' => 'nullable',
                'time' => 'nullable',
            ]);

            $user = auth()->user();

            $validatedData['user_id'] = $user->id;

            $booking = Booking::create($validatedData);

            return createdResponseHandler('booking sent succesfully',$booking,);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }

    }

    public function updateBookingStatus($booking_id)
    {
        try {
            // $validated = $request->validate([
            //     'order_id' => 'required|integer|exists:orders,id',
            // ]);

            // Find the order by ID and check its current status
            $booking = Booking::where('id', $booking_id)
                ->where('received', 'false') // Ensure it's 'complete'
                ->first();

            if (!$booking) {
                return notFoundResponseHandler('Order not found or not in a complete status.');
            }

            // Update the order status to 'delivered'
            $booking->received = 'true';
            $booking->save();

            return successResponseHandler('Booking status updated successfully.', $booking);

            // return response()->json(['message' => 'Order status updated to delivered and sub-orders are ready for payouts.']);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function getBookingsForSeller()
    {
        try{
            // Fetch all sub-orders for the logged-in seller
            $bookings = Booking::with(['product','seller','subCategory','user'])
                ->where('seller_id', auth()->id())
                ->get();

            return successResponseHandler('fetched bookings for seller', $bookings);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function getBookingsForBuyer()
    {
        try{
            // Fetch all sub-orders for the logged-in buyer
            $bookings = Booking::with(['product','seller','subCategory','user'])
                ->where('user_id', auth()->id())
                ->get();

            return successResponseHandler('fetched bookings for buyer', $bookings);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = auth()->user(); // Get the authenticated user

            $booking = Order::where('id', $id)
                ->where('seller_id', $user->id)
                ->first();

            if (!$booking) {
                return response()->json(['error' => 'Booking not found or access denied'], 404);
            }

            $validatedData = $request->validate([
                'status' => 'required|in:pending,delivered,canceled',
            ]);

            $booking->update($validatedData);

            return successResponseHandler('Booking updated successfully', $booking);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }
}
