<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Seller;
use App\Models\UserPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellerPackageController extends Controller
{
    public function selectPackage(Request $request)
    {
        try {
            $request->validate([
                'package_id' => 'required|exists:packages,id',
            ]);

            $userId = Auth::user()->id;

            // Check if the package is inactive
            $package = Package::where('id', $request->package_id)
                ->where('status', 'inactive')
                ->exists();

            if ($package) {
                return successResponseHandler("the seclected package is inactive", $package);
            }

            // Check if the user already has a selected package
            $existingSelection = UserPackage::where('user_id', $userId)->first();

            if ($existingSelection) {
                // Update the existing package
                $existingSelection->update([
                    'package_id' => $request->package_id,
                ]);

                $message = 'Package updated successfully.';
            } else {
                // Create a new package selection
                UserPackage::create([
                    'user_id' => $userId,
                    'package_id' => $request->package_id,
                ]);

                $message = 'Package selected successfully.';
            }

            // Load the seller and the updated package information
            // $seller = Seller::where('user_id', $userId)
            //     ->with(['user', 'packages.userPackages'])
            //     ->first();

            $seller = Seller::where('user_id', $userId)
                ->with([
                    'user',
                    'packages' => function ($query) use ($userId) {
                        $query->with(['userPackages' => function ($q) use ($userId) {
                            $q->where('user_id', $userId);
                        }]);
                    },
                ])
                ->first();

            return successResponseHandler($message, $seller);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
    }


    // public function selectPackage(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             // 'user_id' => 'required|exists:sellers,user_id',
    //             'package_id' => 'required|exists:packages,id',
    //         ]);

    //         // Check if the user already has a selected package
    //         $existingSelection = UserPackage::where('user_id', Auth::user()->id)->first();
    //         if ($existingSelection) {
    //             $seller = Seller::where('user_id', Auth::user()->id)
    //                 ->with(['user', 'userPackage.package'])
    //                 ->first();
    //             return response()->json([
    //                 'status' => 'success',
    //                 'message' => 'Seller already has a selected package. Update instead.',
    //                 'data' => $seller
    //             ], 409);
    //         }

    //         $package = Package::where('id', $request->package_id)->where('status', 'inactive')->exists();

    //         if ($package) {
    //             return successResponseHandler("the seclected package is inactive", $package);
    //         }

    //         // Link the seller to the package
    //         $userPackage = UserPackage::create([
    //             'user_id' => Auth::user()->id,
    //             'package_id' => $request->package_id,
    //         ]);

    //         // Load the seller and the package information
    //         $seller = Seller::where('user_id', Auth::user()->id)
    //         ->with(['user', 'userPackage.package'])
    //         ->first();

    //         return successResponseHandler('Package selected successfully.', $seller);

    //     } catch (\Exception $e) {
    //         return errorResponseHandler($e->getMessage());
    //     }
    // }
}
