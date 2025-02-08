<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use Illuminate\Http\Request;

class RatingsController extends Controller
{
    public function store(Request $request)
    {
        try {
            $user = auth()->user();

            $validatedData = $request->validate([
                'product_id' => 'required|exists:products,id',
                'comment' => 'nullable|string|max:255',
                'rating' => 'required|integer|min:0',
                'image_url1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image_url2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $validatedData['user_id'] = $user->id;

            // Handle image upload
            if ($request->hasFile('image_url1')) {
                $image = $request->file('image_url1');
                $imagePath = $image->store('products', 'public'); // Save in the "public/products" directory
                $validatedData['image_url'] = $imagePath;
            }
            // Handle image upload
            if ($request->hasFile('image_url2')) {
                $image = $request->file('image_url2');
                $imagePath = $image->store('products', 'public'); // Save in the "public/products" directory
                $validatedData['image_url2'] = $imagePath;
            }

            $rating = Rating::create($validatedData);

            return createdResponseHandler('rated the product succesfully',$rating,);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    /**
     * Get all categories.
     */
    public function index()
    {
        try {
            $ratings = Rating::with(['product'])->get();

            return successResponseHandler('fetched ratings successfully',$ratings);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }
}
