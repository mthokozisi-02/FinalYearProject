<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        // $user = auth()->user();
        // if ($user->package->status === 'inactive') {
        //     return redirect()->route('packages.select')->with('error', 'Your package is inactive. Please select a new one.');
        // }
        
        if (auth()->check() && auth()->user()->role === $role) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
