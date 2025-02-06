<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PackageController extends Controller
{
    public function getPackages()
    {
        try {
            $packages = Package::latest()->get();

            return successResponseHandler('all packages fetched successfully', $packages);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function find($id)
    {
        try {
            $package = Package::find($id);

            if (!$package) {
                return notFoundResponseHandler('Package not found.');
            }

            return successResponseHandler("package found", $package);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function createPackage(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'min:2', 'max:100'],
                'description' => ['required'],
                'price' => ['required','numeric'],
                'number_of_products' => ['required', 'integer']
            ]);

            if ($validator->fails()) {
                return errorValidationResponseHandler($validator->errors());
            }

            $package = Package::create($validator->validated());

            return createdResponseHandler('Package created successfully', $package);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }

    public function updatePackage(Request $request, $id)
    {
        try {
            $package = Package::find($id);

            if (!$package) {
                return notFoundResponseHandler('Package not found.');
            }

            $request->validate([
                'name' => 'string|max:255',
                'description' => 'string',
                'price' => 'numeric|min:0',
                'number_of_products' => 'integer|min:0',
            ]);

            $package->update($request->all());

            return successResponseHandler('Package updated successfully.', $package);
        
        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }

    }

    public function updateStatus($id)
    {
        try {
            $package = Package::find($id);

            if (!$package) {
                return notFoundResponseHandler("Package not found");
            }

            $package->status = $package->status === "active" ? "inactive" : "active";
            $package->save();

            return successResponseHandler("updated status successfully", $package);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }
}
