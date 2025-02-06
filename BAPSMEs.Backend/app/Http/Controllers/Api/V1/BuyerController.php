<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\VerificationMail;
use App\Models\Buyer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class BuyerController extends Controller
{
     // Create Buyer
     public function store(Request $request)
     {
        Log::info('request :', $request->all());
        try {
            $request->validate([
                'name' => 'required|string',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                //  'role' => 'required|string',
                'id_number' => 'required|string|unique:buyers,id_number',
                'country' => 'required|string',
                'phone' => 'required|string',
                'address' => 'required|string',
                'profile_pic' => 'nullable|image|max:2048',
            ]);
    
            DB::beginTransaction();
            
            // Create User
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => "buyer",
            ]);

            $imagePath = null;
            
            // Handle image upload
            if ($request->hasFile('profile_pic')) {
                $image = $request->file('profile_pic');
                $imagePath = $image->store('profile_pics', 'public'); // Save in the "public/products" directory
                // $validatedData['image_url'] = $imagePath;
            }
    
            // Handle Profile Picture Upload
        //    $profilePicPath = $request->file('profile_pic') 
        //         ? url($request->file('profile_pic')->store('profile_pics')) 
        //         : null;
        //     $profilePicUrl = $profilePicPath ? Storage::url('profile_pics/' . $profilePicPath) : null;

            // Create Buyer
            $buyer = Buyer::create([
                'user_id' => $user->id,
                'id_number' => $request->id_number,
                'country' => $request->country,
                'phone' => $request->phone,
                'address' => $request->address,
                'profile_pic' => $imagePath,
            ]);

            DB::commit();

            Mail::to($user->email)->send(new VerificationMail($user));

            // Return the user with buyer details
            $user->load('buyer');

            return createdResponseHandler('Buyer created successfully', $user);

        } catch (\Exception $e) {
            DB::rollBack();
            return errorResponseHandler($e->getMessage());
        }
     }
 
     // Get all Buyers
     public function index()
     {
        try {
            $buyers = Buyer::with('user')->get();
            return successResponseHandler("Buyers fecthed successfully", $buyers);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
     }
 
     // Get a specific Buyer
     public function show($id)
     {
        try {
            $buyer = Buyer::with('user')->find($id);

            if (!$buyer) {
                return notFoundResponseHandler('Buyer not found');
            }

            return successResponseHandler("Buyer fetched successfully", $buyer);

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        }
     }
 
     // Update Buyer
     public function update(Request $request, $id)
     {
        try {
            $buyer = Buyer::find($id);
            if (!$buyer) {
                return notFoundResponseHandler('Buyer not found');
            }
    
            $request->validate([
                'name' => 'sometimes|string',
                'email' => 'sometimes|email',
                'password' => 'nullable|string|min:8',
                'role' => 'sometimes|string',
                'id_number' => 'sometimes|string',
                'country' => 'sometimes|string',
                'phone' => 'sometimes|string',
                'address' => 'sometimes|string',
                'profile_pic' => 'nullable|image|max:2048',
            ]);
            
            DB::beginTransaction();

            // Update User
            $buyer->user->update([
                'name' => $request->name ?? $buyer->user->name,
                'email' => $request->email ?? $buyer->user->email,
                'password' => $request->password ? Hash::make($request->password) : $buyer->user->password,
                'role' => $request->role ?? $buyer->user->role,
            ]);
    
            // Handle Profile Picture Update
            // if ($request->file('profile_pic')) {
            //     if ($buyer->profile_pic) {
            //         Storage::delete($buyer->profile_pic);
            //     }
            //     $profilePicPath = $request->file('profile_pic')->store('profile_pics');
            //     $buyer->profile_pic = $profilePicPath;
            // }

            // Handle image upload
            if ($request->hasFile('profile_pic')) {
                // Delete the old image if it exists
                if ($buyer->image_path && Storage::disk('public')->exists($buyer->profile_pic)) {
                    Storage::disk('public')->delete($buyer->profile_pic);
                }

                // Save the new image
                $image = $request->file('profile_pic');
                $imagePath = $image->store('profile_pics', 'public');
                $buyer->profile_pic = $imagePath;
            }
    
            // Update Buyer
            $buyer->update($request->only(['id_number', 'country', 'phone', 'address']));
    
            DB::commit();

            return successResponseHandler('Buyer updated successfully', $buyer);

        } catch (\Exception $e) {
            DB::rollBack();
            return errorResponseHandler($e->getMessage());
        } 
     }
 
     // Delete Buyer
     public function destroy($id)
     {
        try {
            $buyer = Buyer::find($id);

            if (!$buyer) {
                return notFoundResponseHandler('Buyer not found');
            }
    
            if ($buyer->profile_pic) {
                Storage::delete($buyer->profile_pic);
            }
    
            $buyer->user->delete();
            $buyer->delete();
    
            return deleteSuccessHandler('Buyer deleted successfully');

        } catch (\Exception $e) {
            return errorResponseHandler($e->getMessage());
        } 
    }
}
