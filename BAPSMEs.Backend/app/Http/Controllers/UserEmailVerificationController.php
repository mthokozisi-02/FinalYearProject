<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class UserEmailVerificationController extends Controller
{
    // public function verify($id)
    // {
    //     $user = User::find($id);

    //     if (!$user) {
    //         return notFoundResponseHandler('User not found or already verified.');
    //         // return redirect('/')->withErrors(['message' => 'User not found or already verified.']);
    //     }

    //     $user->email_verified_at = now();
    //     $user->save();

    //     return successResponseHandler('Your email has been verified successfully!', $user);
    //     // return redirect('/')->with('success', 'Your email has been verified successfully!');
    // }

    public function verify($id)
    {
        try {
            $decryptedId = Crypt::decryptString($id);
        } catch (DecryptException $e) {
            return view('verification.failed', ['message' => 'Invalid or expired verification link.']);
        }

        $user = User::find($decryptedId);

        if (!$user || $user->email_verified_at) {
            return view('verification.failed', ['message' => 'User not found or already verified.']);
        }

        $user->email_verified_at = now();
        $user->save();

        return view('verification.success', ['message' => 'Your email has been verified successfully!']);
    }

}
