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
            ]);

            $validatedData['user_id'] = $user->id;

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
