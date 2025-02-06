<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\UserPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductsController extends Controller
{
    public function index()
    {
        try {
            $products = Product::with(['subcategory'])
                ->where('quantity', '>', 0)
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

            $products = Product::with(['subcategory.category'])->where('user_id', $user->id)->get();

            return successResponseHandler('fetched seller products successfully',$products);

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
                'sub_category_id' => 'required|exists:sub_categories,id',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'quantity' => 'required|integer|min:0',
                'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $validatedData['user_id'] = $user->id;

            // Handle image upload
            if ($request->hasFile('image_url')) {
                $image = $request->file('image_url');
                $imagePath = $image->store('products', 'public'); // Save in the "public/products" directory
                $validatedData['image_url'] = $imagePath;
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

            // Validate request data
            $validatedData = $request->validate([
                'sub_category_id' => 'required|exists:sub_categories,id',
                'name' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'price' => 'nullable|numeric|min:0',
                'quantity' => 'nullable|integer|min:0',
                'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate new image
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
