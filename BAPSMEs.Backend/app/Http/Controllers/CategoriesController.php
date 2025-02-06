<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $category = Category::create($validatedData);

            return createdResponseHandler('created category',$category,);

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
            $categories = Category::with(['subcategories'])->get();

            return successResponseHandler('fetched categories successfully',$categories);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    /**
     * Get a specific category.
     */
    public function show($id)
    {
        try {
            $category = Category::with(['subcategories'])->find($id);

            if (!$category) {
                return notFoundResponseHandler('Category not found');
            }

            return successResponseHandler('fetched category successfully',$category);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    /**
     * Update a category.
     */
    public function update(Request $request, $id)
    {
        try {
            $category = Category::find($id);

            if (!$category) {
                return notFoundResponseHandler('Category not found');
            }

            $validatedData = $request->validate([
                'name' => 'nullable|string|max:255',
                'description' => 'nullable|string',
            ]);

            $category->update($validatedData);

            return successResponseHandler('updated category successfully', $category);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    /**
     * Delete a category.
     */
    public function destroy($id)
    {
        try {
            $category = Category::find($id);

            if (!$category) {
                return notFoundResponseHandler('Category not found');
            }

            $category->delete();

            return deletedResponseHandler('Category deleted successfully');

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }
}
