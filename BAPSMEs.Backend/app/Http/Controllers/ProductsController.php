<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\UserPackage;
use App\ProductSimilarity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductsController extends Controller
{
    public function index()
    {
        try {
            $products = Product::with(['subcategory','ratings','enquiries'])
                ->where('status', '=', 'Active')
                ->get();

            return successResponseHandler('fetched products successfully',$products);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function find($id)
    {
        try {
            $product = Product::with(['subcategory.category'])->find($id);

            return successResponseHandler('fetched product', $product);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function findByCategory($sub_category_id)
    {
        try {
            $products = Product::with(['subcategory.category'])->where('sub_category_id', $sub_category_id)->first();

            return successResponseHandler('fetched product', $products);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function sellerProducts()
    {
        try {
            $user = auth()->user();

            $products = Product::with(['subcategory.category','enquiries'])->where('user_id', $user->id)->get();

            return successResponseHandler('fetched seller products successfully',$products);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function getSimilarProducts($id)
    {
        try {
            // Get products with all necessary relationships
            $products = Product::with(['subcategory', 'ratings', 'enquiries'])
                ->where('status', '=', 'Active')
                ->get();

            // Find the specific product
            $product = $products->firstWhere('id', $id);

            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            // Initialize similarity calculator with products
            $productSimilarity = new ProductSimilarity($products->toArray());

            // Calculate similarity matrix
            $similarityMatrix = $productSimilarity->calculateSimilarityMatrix();

            // Get sorted similar products
            $similarProducts = $productSimilarity->getProductsSortedBySimularity($id, $similarityMatrix);

            return response()->json([
                'status' => 'success',
                'data' => $similarProducts
            ]);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $user = auth()->user();

            // Check if the user has an active subscription
            $subscription = Subscription::whereHas('userPackage', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->where('status', 'active')
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now())
            ->first();

            if (!$subscription) {
                return forbiddenResponseHandler('You must have an active subscription to upload products.');
            }

            // Get the user's package and product limit
            $userPackage = $subscription->userPackage;
            $package = Package::find($userPackage->package_id);

            if (!$package || $package->number_of_products <= 0) {
                return forbiddenResponseHandler('No valid package assigned or package does not allow any products.');
            }

            // Count current products
            $productCount = Product::where('user_id', $user->id)->count();

            if ($productCount >= $package->number_of_products) {
                return forbiddenResponseHandler('Product limit reached for your package.');
            }

            // Validate and create the product
            $validatedData = $request->validate([
                // Required fields
                'sub_category_id' => 'required|exists:sub_categories,id',
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',

                // Optional text fields
                'description' => 'nullable|string',
                'bookable' => 'nullable|string',
                'delivery_options' => 'nullable|string',
                'dietary_information' => 'nullable|string',
                'shipping_options' => 'nullable|string',
                'warranty_information' => 'nullable|string',
                'service_area' => 'nullable|string',
                'qualification' => 'nullable|string',
                'language_support' => 'nullable|string',
                'certifications' => 'nullable|string',
                'project_type' => 'nullable|string',
                'turnaround_time' => 'nullable|string',
                'revisions_included' => 'nullable|string',
                'file_formats' => 'nullable|string',
                'usage_rights' => 'nullable|string',
                'materials_included' => 'nullable|string',
                'prerequisites' => 'nullable|string',
                'vehicle_type' => 'nullable|string',
                'parts_included' => 'nullable|string',
                'loaner_vehicle' => 'nullable|string',
                'project_scope' => 'nullable|string',
                'license_number' => 'nullable|string',
                'insurance_coverage' => 'nullable|string',
                'permit_handling' => 'nullable|string',
                'warranty_period' => 'nullable|string',
                'equipment_provided' => 'nullable|string',
                'catering_options' => 'nullable|string',
                'parking_availability' => 'nullable|string',
                'property_types' => 'nullable|string',
                'response_time' => 'nullable|string',
                'policy_term' => 'nullable|string',
                'premium_frequency' => 'nullable|string',

                // Optional numeric fields
                'preparation_time' => 'nullable|numeric',
                'minimum_order' => 'nullable|integer',
                'service_duration' => 'nullable|integer',
                'experience_level' => 'nullable|integer',
                'class_size' => 'nullable|integer',
                'capacity' => 'nullable|integer',
                'age_restriction' => 'nullable|integer',
                'deductible_amount' => 'nullable|numeric',
                'coverage_limit' => 'nullable|numeric',
                'minimum_balance' => 'nullable|numeric',
                'interest_rate' => 'nullable|numeric',
                'fees' => 'nullable|numeric',
                'transaction_limit' => 'nullable|numeric',

                // Enums
                'status' => 'required|in:Active,Inactive,Pending',
                'service_type' => 'required|in:Product,Service',
                'product_type' => 'required|in:Physical,Digital',
                'inventory_status' => 'required|in:Available,"Out of Stock"',
                'return_policy' => 'required|in:Return,"Exchange Terms"',
                'appointment' => 'required|in:yes,no',
                'location_type' => 'required|in:On-Site,Off-Site,Virtual',
                'expertise_level' => 'required|in:Beginner,Intermediate,Advanced',
                'session_format' => 'required|in:Individual,Group',
                'course_format' => 'required|in:Online,In-person',
                'construction_project_type' => 'required|in:New Build,Renovation,Repair',
                'service_scope' => 'required|in:"Full Project Management","Consultation-only"',
                'payment_term' => 'required|in:Milestone-based,Progressive',
                'coverage_type' => 'required|in:Property,Liability,Life',
                'account_type' => 'required|in:Personal,Business,investment',
                'service_level' => 'required|in:Full,"Partial Management",Basic,Standard,Premium',
                'management_fee' => 'required|in:Percentage,"Flat Rate"',
                'quantity' => 'required|integer|min:0',

                // Image validation
                'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image_url2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image_url3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $validatedData['user_id'] = $user->id;

            // Handle image upload
            if ($request->hasFile('image_url')) {
                $image = $request->file('image_url');
                $imagePath = $image->store('products', 'public'); // Save in the "public/products" directory
                $validatedData['image_url'] = $imagePath;
            }
            // Handle image upload
            if ($request->hasFile('image_url2')) {
                $image = $request->file('image_url2');
                $imagePath = $image->store('products', 'public'); // Save in the "public/products" directory
                $validatedData['image_url2'] = $imagePath;
            }
            // Handle image upload
            if ($request->hasFile('image_url3')) {
                $image = $request->file('image_url3');
                $imagePath = $image->store('products', 'public'); // Save in the "public/products" directory
                $validatedData['image_url3'] = $imagePath;
            }

            $product = Product::create($validatedData);

            return createdResponseHandler('Product uploaded successfully', $product);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    // public function store(Request $request)
    // {
    //     try {
    //         $user = auth()->user();

    //         // Get the current user's package and the product limit
    //         $userPackage = UserPackage::where('user_id', $user->id)
    //             ->first();

    //         $package = Package::where('id', $userPackage->package_id)
    //             ->where('status', 'active')
    //             ->first();

    //         if (!$package || $package->number_of_products <= 0) {
    //             return forbiddenResponseHandler('No package assigned or package does not allow any products');
    //         }

    //         // Count current products
    //         $productCount = Product::where('user_id', $user->id)->count();

    //         if ($productCount >= $package->number_of_products) {
    //             return forbiddenResponseHandler('Product limit reached for your package');
    //         }

    //         // Create the product
    //         $validatedData = $request->validate([
    //             'sub_category_id' => 'required|exists:sub_categories,id',
    //             'name' => 'required|string|max:255',
    //             'description' => 'nullable|string',
    //             'price' => 'required|numeric|min:0',
    //             'quantity' => 'required|integer|min:0',
    //             'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
    //         ]);

    //         $validatedData['user_id'] = $user->id;

    //         // Handle image upload
    //         if ($request->hasFile('image_url')) {
    //             $image = $request->file('image_url');
    //             $imagePath = $image->store('products', 'public'); // Save in the "public/products" directory
    //             $validatedData['image_url'] = $imagePath;
    //         }

    //         $product = Product::create($validatedData);

    //         return createdResponseHandler('Product uploaded successfully', $product);

    //     } catch (\Exception $e) {
    //         return errorResponseHandler($e->getMessage());
    //     }
    // }

    public function update(Request $request, $id)
    {
        try {
            $user = auth()->user();

            // Ensure the product exists and belongs to the authenticated user
            $product = Product::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$product) {
                return forbiddenResponseHandler( 'Product not found or you do not have permission to update it');
            }

            // Validate and create the product
            $validatedData = $request->validate([
                // Required fields
                'sub_category_id' => 'required|exists:sub_categories,id',
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',

                // Optional text fields
                'description' => 'nullable|string',
                'bookable' => 'nullable|string',
                'delivery_options' => 'nullable|string',
                'dietary_information' => 'nullable|string',
                'shipping_options' => 'nullable|string',
                'warranty_information' => 'nullable|string',
                'service_area' => 'nullable|string',
                'qualification' => 'nullable|string',
                'language_support' => 'nullable|string',
                'certifications' => 'nullable|string',
                'project_type' => 'nullable|string',
                'turnaround_time' => 'nullable|string',
                'revisions_included' => 'nullable|string',
                'file_formats' => 'nullable|string',
                'usage_rights' => 'nullable|string',
                'materials_included' => 'nullable|string',
                'prerequisites' => 'nullable|string',
                'vehicle_type' => 'nullable|string',
                'parts_included' => 'nullable|string',
                'loaner_vehicle' => 'nullable|string',
                'project_scope' => 'nullable|string',
                'license_number' => 'nullable|string',
                'insurance_coverage' => 'nullable|string',
                'permit_handling' => 'nullable|string',
                'warranty_period' => 'nullable|string',
                'equipment_provided' => 'nullable|string',
                'catering_options' => 'nullable|string',
                'parking_availability' => 'nullable|string',
                'property_types' => 'nullable|string',
                'response_time' => 'nullable|string',
                'policy_term' => 'nullable|string',
                'premium_frequency' => 'nullable|string',

                // Optional numeric fields
                'preparation_time' => 'nullable|numeric',
                'minimum_order' => 'nullable|integer',
                'service_duration' => 'nullable|integer',
                'experience_level' => 'nullable|integer',
                'class_size' => 'nullable|integer',
                'capacity' => 'nullable|integer',
                'age_restriction' => 'nullable|integer',
                'deductible_amount' => 'nullable|numeric',
                'coverage_limit' => 'nullable|numeric',
                'minimum_balance' => 'nullable|numeric',
                'interest_rate' => 'nullable|numeric',
                'fees' => 'nullable|numeric',
                'transaction_limit' => 'nullable|numeric',

                // Enums
                'status' => 'required|in:Active,Inactive,Pending',
                'service_type' => 'required|in:Product,Service',
                'product_type' => 'required|in:Physical,Digital',
                'inventory_status' => 'required|in:Available,"Out of Stock"',
                'return_policy' => 'required|in:Return,"Exchange Terms"',
                'appointment' => 'required|in:yes,no',
                'location_type' => 'required|in:On-Site,Off-Site,Virtual',
                'expertise_level' => 'required|in:Beginner,Intermediate,Advanced',
                'session_format' => 'required|in:Individual,Group',
                'course_format' => 'required|in:Online,In-person',
                'construction_project_type' => 'required|in:New Build,Renovation,Repair',
                'service_scope' => 'required|in:"Full Project Management","Consultation-only"',
                'payment_term' => 'required|in:Milestone-based,Progressive',
                'coverage_type' => 'required|in:Property,Liability,Life',
                'account_type' => 'required|in:Personal,Business,investment',
                'service_level' => 'required|in:Full,"Partial Management",Basic,Standard,Premium',
                'management_fee' => 'required|in:Percentage,"Flat Rate"',
                'quantity' => 'required|integer|min:0',

                // Image validation
                'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image_url2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image_url3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Handle image upload
            if ($request->hasFile('image_url')) {
                // Delete the old image if it exists
                if ($product->image_url && Storage::disk('public')->exists($product->image_url)) {
                    Storage::disk('public')->delete($product->image_url);
                }

                // Save the new image
                $image = $request->file('image_url');
                $imagePath = $image->store('products', 'public');
                $validatedData['image_url'] = $imagePath;
            }

            // Handle image upload
            if ($request->hasFile('image_url2')) {
                // Delete the old image if it exists
                if ($product->image_url && Storage::disk('public')->exists($product->image_url)) {
                    Storage::disk('public')->delete($product->image_url);
                }

                // Save the new image
                $image = $request->file('image_url2');
                $imagePath = $image->store('products', 'public');
                $validatedData['image_url2'] = $imagePath;
            }

            // Handle image upload
            if ($request->hasFile('image_url3')) {
                // Delete the old image if it exists
                if ($product->image_url && Storage::disk('public')->exists($product->image_url)) {
                    Storage::disk('public')->delete($product->image_url);
                }

                // Save the new image
                $image = $request->file('image_url3');
                $imagePath = $image->store('products', 'public');
                $validatedData['image_url3'] = $imagePath;
            }

            // Update the product
            $product->update($validatedData);

            // Add image URL to the response
            $product->image_url = $product->image_url ? asset('storage/' . $product->image_path) : null;

            return successResponseHandler('updated product successfully',$product);
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $user = auth()->user();
            $product = Product::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$product) {
                return forbiddenResponseHandler( 'Product not found or you do not have permission to delete it');
            }

            $product->delete();

            return deletedResponseHandler('Product deleted successfully');

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }


}
