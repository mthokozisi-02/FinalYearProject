<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Models\Order;
use App\Models\Product;
use App\Models\Rating;
use App\Models\SubOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EnquiryController extends Controller
{
    /**
     * Get a list of orders.
     */
    public function index()
    {
        try {
            $enquiries = Enquiry::with(['product','seller','subCategory','user'])->where('user_id', auth()->id())->get();
            return successResponseHandler('fetched enquiries successfully', $enquiries);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function getAllEnquiries()
    {
        try {
            // Retrieve all enquiries with their sub-orders and products
            $enquiries = Enquiry::with(['product','seller','subCategory','user'])->latest()->get();

            return successResponseHandler('Enquiries retrieved successfully.', $enquiries);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function showBuyerEnquiry($enquiryId)
    {
        // $enquiry = Order::with('subOrders.products')->findOrFail($enquiryId);
        $enquiry = Enquiry::with(['product','seller','subCategory','user'])->findOrFail($enquiryId);

        // Aggregate all products across sub-orders
        // $products = $enquiry->subOrders->flatMap(function ($subOrder) {
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
        //     'order_id' => $enquiry->id,
        //     'total_price' => $enquiry->total_price,
        //     'status' => $enquiry->status,
        //     'products' => $products,
        // ];

        return successResponseHandler('Enquiry details fetched successfully', $enquiry);
    }

    /**
     * Get a specific order.
     */
    public function show($id)
    {
        try {
            $enquiry = Enquiry::with(['product','seller','subCategory','user'])->where('id', $id)->where('user_id', auth()->id())->first();

            if (!$enquiry) {
                return notFoundResponseHandler('Enquiry not found');
            }

            return successResponseHandler('Enquiry fetched successfully', $enquiry);
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

            // Core fields
            'preferred_contact_method' => 'nullable|string',
            'payment_method' => 'nullable|string',
            'enquiry_type' => 'nullable|string',
            'urgency_level' => 'nullable|string',
            'additional_information' => 'nullable|string|max:255',
            'preferred_time' => 'nullable|string|max:255',
            'preferred_date' => 'nullable|string|max:255',

            // Construction fields
            'project_details' => 'nullable|string|max:255',
            'payment_schedule' => 'nullable|string|max:255',

            // Insurance and Banking fields
            'preferred_location' => 'nullable|string|max:255',
            'insurance_type' => 'nullable|string',

            // Common service fields
            'service_interest' => 'nullable|string|max:255',
            'account_requirements' => 'nullable|string|max:255',
            'transaction_requirements' => 'nullable|string|max:255',
            'documentation_needed' => 'nullable|string|max:255',

            // Property fields
            'management_duration' => 'nullable|string|max:255',

            // Food and Beverage fields
            'cuisine_preference' => 'nullable|string|max:255',
            'budget_range' => 'nullable|string|max:255',
            'special_occasion_details' => 'nullable|string|max:255',

            // Retail fields
            'price_range' => 'nullable|string|max:255',
            'availability_requirements' => 'nullable|string|max:255',
            'customization_needs' => 'nullable|string|max:255',

            // Services fields
            'service_requirements' => 'nullable|string|max:255',

            // Creative Service fields
            'style_references' => 'nullable|string|max:255',

            // Education fields
            'area_of_interest' => 'nullable|string|max:255',
            'experience_level' => 'nullable|string|max:255',
            'learning_goals' => 'nullable|string|max:255',

            // Automotive fields
            'vehicle_information' => 'nullable|string|max:255',
            'service_type_interest' => 'nullable|string|max:255',
            'preferred_time_frame' => 'nullable|string|max:255',

            // Home fields
            'project_type' => 'nullable|string|max:255',
            'property_information' => 'nullable|string|max:255',

            // Entertainment fields
            'event_type' => 'nullable|string|max:255',
            'guest_information' => 'nullable|string|max:255',
            'special_requirements' => 'nullable|string|max:255'
        ]);

        $user = auth()->user();

        $validatedData['user_id'] = $user->id;

            $enquiry = Enquiry::create($validatedData);

            return createdResponseHandler('enquiry sent succesfully',$enquiry,);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }

    }

    public function updateEnquiryStatus($enquiry_id)
    {
        try {
            // $validated = $request->validate([
            //     'order_id' => 'required|integer|exists:orders,id',
            // ]);

            // Find the order by ID and check its current status
            $enquiry = Enquiry::where('id', $enquiry_id)
                ->where('received', 'false') // Ensure it's 'complete'
                ->first();

            if (!$enquiry) {
                return notFoundResponseHandler('Order not found or not in a complete status.');
            }

            // Update the order status to 'delivered'
            $enquiry->received = 'true';
            $enquiry->save();

            return successResponseHandler('Enquiry status updated successfully.', $enquiry);

            // return response()->json(['message' => 'Order status updated to delivered and sub-orders are ready for payouts.']);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function getEnquiriesForSeller()
    {
        try{
        // Fetch all sub-orders for the logged-in seller
        $enquiries = Enquiry::with(['product','seller','subCategory','user'])
            ->where('seller_id', auth()->id())
            ->get();

            return successResponseHandler('fetched enquiries for seller', $enquiries);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function getEnquiriesForBuyer()
    {
        try{
            // Fetch all sub-orders for the logged-in buyer
            $enquiries = Enquiry::with(['product','seller','subCategory','user'])
                ->where('user_id', auth()->id())
                ->get();

            return successResponseHandler('fetched enquiries for buyer', $enquiries);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = auth()->user(); // Get the authenticated user

            $enquiry = Order::where('id', $id)
                ->where('seller_id', $user->id)
                ->first();

            if (!$enquiry) {
                return response()->json(['error' => 'Order not found or access denied'], 404);
            }

            $validatedData = $request->validate([
                'status' => 'required|in:pending,delivered,canceled',
            ]);

            $enquiry->update($validatedData);

            return successResponseHandler('Order updated successfully', $enquiry);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }
}
