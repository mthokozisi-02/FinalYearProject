<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoriesController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $subcategory = Subcategory::create($validatedData);

            return createdResponseHandler('Created subcategory successfully', $subcategory);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    /**
     * Get all subcategories.
     */
    public function index()
    {
        try {
            $subcategories = Subcategory::with(['category', 'products'])->get();

            return successResponseHandler('Fetched subcategories successfully', $subcategories);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    /**
     * Get a specific subcategory.
     */
    public function show($id)
    {
        try {
            $subcategory = Subcategory::with('category')->find($id);

            if (!$subcategory) {
                return notFoundResponseHandler('Subcategory not found');
            }

            return successResponseHandler('Fetched subcategory successfully', $subcategory);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    /**
     * Update a subcategory.
     */
    public function update(Request $request, $id)
    {
        try {
            $subcategory = Subcategory::find($id);

            if (!$subcategory) {
                return notFoundResponseHandler('Subcategory not found');
            }

            $validatedData = $request->validate([
                'category_id' => 'nullable|exists:categories,id',
                'name' => 'nullable|string|max:255',
                'description' => 'nullable|string',
            ]);

            $subcategory->update($validatedData);

            return successResponseHandler('Updated subcategory successfully', $subcategory);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    /**
     * Delete a subcategory.
     */
    public function destroy($id)
    {
        try {
            $subcategory = SubCategory::find($id);

            if (!$subcategory) {
                return notFoundResponseHandler('Subcategory not found');
            }

            $subcategory->delete();

            return deletedResponseHandler('Subcategory deleted successfully');

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }
}
