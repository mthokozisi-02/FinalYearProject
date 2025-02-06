<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Support\Facades\Hash;



class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|max:255|confirmed',
            'role' => 'required|string|in:admin,buyer,seller', // Validate role
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role, // Save role
            ]);

        if($user)
        {
            $token = $user->createToken($user->name . 'Auth-Token')->plainTextToken;

            return response()->json([
            'message' => 'Registration Successful',
            'token_type' => 'Bearer',
            'token' => $token
             ], 201);
        }
        else
        {
            return response()->json([
           'message' => 'Something went wrong while registering.',
            ], 500);
        }
      
       
    }
    
    public function login(Request $request): JsonResponse
    {
        $request->validate([
        'email' => 'required|email|max:255',
        'password' => 'required|string|min:8|max:255',
        ]);

        $user = User::where('email', $request->email)
            ->with([
                'seller', 
                'bankDetails', 
                'seller.packages'])
            ->first();
     
        if(!$user || !hash::check($request->password, $user->password)){
            return response()->json([
                'message' => 'Incorrect Credentials'
            ], 401);
        }

        $token = $user->createToken($user->name.'Auth-Token')->plainTextToken;


        return response()->json([
        'message' => 'Login Successful',
        'token_type' => 'Bearer',
        'token' => $token,
        'user' => $user
        ], 200);
    }

    
}
