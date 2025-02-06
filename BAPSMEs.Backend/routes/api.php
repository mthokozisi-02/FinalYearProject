<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BuyerController;
use App\Http\Controllers\Api\V1\EquipmentController;
use App\Http\Controllers\Api\V1\MetalsController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PackageController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\PayoutsController;
use App\Http\Controllers\Api\V1\SellerController;
use App\Http\Controllers\Api\V1\SellerPackageController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SubCategoriesController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserEmailVerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('verify-email/{id}', [UserEmailVerificationController::class, 'verify'])->name('verification.verify');

Route::get('/paypal/success', [PaymentController::class, 'success'])->name('paypal.success');
Route::get('/paypal/cancel', [PaymentController::class, 'cancel'])->name('paypal.cancel');

Route::prefix('v1')->group(function() {
    // Public routes
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);

    Route::prefix('packages')->group(function () {
        Route::get('/', [PackageController::class, 'getPackages']);
        Route::get('/{id}', [PackageController::class, 'find']);
    });

    Route::prefix('sellers')->group(function () {
        Route::post('/register', [SellerController::class, 'registerSeller']);
        Route::put('/update/{id}', [SellerController::class, 'update']);
        Route::get('/', [SellerController::class, 'getSellers']);
        Route::get('/{id}', [SellerController::class, 'find']);
    });

    Route::prefix('buyers')->group(function () {
        Route::post('/buyer', [BuyerController::class, 'store']);
        Route::get('buyer', [BuyerController::class, 'index']);
        Route::get('buyer/{id}', [BuyerController::class, 'show']);
        Route::put('buyer/{id}', [BuyerController::class, 'update']);
        Route::delete('buyer/{id}', [BuyerController::class, 'destroy']);
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoriesController::class, 'index']);
        Route::get('/{id}', [CategoriesController::class, 'show']);
    });

    Route::prefix('sub-categories')->group(function () {
        Route::get('/', [SubCategoriesController::class, 'index']);
        Route::get('/{id}', [SubCategoriesController::class, 'show']);
    });

    Route::prefix('products')->group(function () {
        Route::get('/', [ProductsController::class, 'index']);
        Route::get('/{id}', [ProductsController::class, 'find']);
        Route::get('/category/{id}', [ProductsController::class, 'findByCategory']);
    });

    // Protected routes
    Route::middleware(['auth:sanctum'])->group(function () {
        // Routes accessible to all authenticated users
        Route::apiResource('equipment', EquipmentController::class); // Fixed issue
        Route::get('equipment/search/{name}', [EquipmentController::class, 'search']);
        Route::apiResource('/metals', MetalsController::class);
        Route::get('metals/search/{name}', [MetalsController::class, 'search']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);

        Route::prefix('packages')->group(function () {
            Route::post('/register', [PackageController::class, 'createPackage']);
            Route::put('/update/{id}', [PackageController::class, 'updatePackage']);
            Route::put('/update-status/{id}', [PackageController::class, 'updateStatus']);
        });

        Route::prefix('subscriptions')->group(function () {
            Route::post('subscribe', [SubscriptionController::class, 'processPayment']);
        });

        Route::prefix('categories')->group(function () {
            Route::post('/', [CategoriesController::class, 'store']);
            Route::put('/{id}', [CategoriesController::class, 'update']);
            Route::delete('/{id}', [CategoriesController::class, 'destroy']);
        });

        Route::prefix('sub-categories')->group(function () {
            Route::post('/', [SubCategoriesController::class, 'store']);
            Route::put('/{id}', [SubCategoriesController::class, 'update']);
            Route::delete('/{id}', [SubCategoriesController::class, 'destroy']);
        });

        // Admin-only routes
        Route::middleware('role:admin')->group(function () {
            Route::get('/admin/dashboard', function () {
                return response()->json(['message' => 'Welcome Admin']);
            });

            Route::get('/admin/payments', [PaymentController::class, 'getAllPaymentsForAdmin']);
            Route::get('/admin/orders', [OrderController::class, 'showAllSubOrders']);
            Route::put('/admin/update-order-status/{id}', [OrderController::class, 'updateOrderStatus']);

            Route::get('/admin/all-orders', [OrderController::class, 'getAllOrders']);

            Route::get('/admin/sellers-balances', [PayoutsController::class, 'getSellersWithBalances']);
            Route::get('/admin/get-payouts', [PayoutsController::class, 'getPayouts']);
            Route::post('/admin/sellers/make-payouts', [PayoutsController::class, 'makePayouts']);

        });

        // Seller-only routes
        Route::middleware('role:seller')->group(function () {
            Route::get('/seller/dashboard', function () {
                return response()->json(['message' => 'Welcome Seller']);
            });

            Route::post('/seller/select-package', [SellerPackageController::class, 'selectPackage']);

            Route::prefix('products')->group(function () {
                Route::post('/create', [ProductsController::class, 'store']);
                Route::put('/update/{id}', [ProductsController::class, 'update']);
                // Route::get('/', [ProductsController::class, 'index']);
                Route::get('/seller/{id}', [ProductsController::class, 'sellerProducts']);
                // Route::get('/{id}', [ProductsController::class, 'find']);
                Route::delete('/{id}', [ProductsController::class, 'destroy']);
            });

            Route::prefix('orders')->middleware('auth')->group(function () {
                Route::get('/seller/{sellerId}', [OrderController::class, 'getOrdersForSeller']);
                Route::get('/seller', [OrderController::class, 'showAllSellerSubOrders']);
                Route::get('/seller/{sellerId}/pending', [OrderController::class, 'getPendingOrdersForSeller']);
                Route::get('/seller/{sellerId}/completed', [OrderController::class, 'getCompletedOrdersForSeller']);
                Route::get('/seller/{sellerId}/canceled', [OrderController::class, 'getCanceledOrdersForSeller']);
                Route::put('/{id}', [OrderController::class, 'update']);
                Route::delete('/{id}', [OrderController::class, 'destroy']);
            });

            Route::get('/seller/payments', [PaymentController::class, 'getPaymentsForSeller']);

        });

        // Buyer-only routes
        Route::middleware('role:buyer')->group(function () {
            Route::get('/buyer/dashboard', function () {
                return response()->json(['message' => 'Welcome Buyer']);
            });

            Route::get('/buyer/payments', [PaymentController::class, 'getPaymentsForBuyer']);

        });



        Route::prefix('orders')->middleware('auth')->group(function () {
            Route::post('/', [OrderController::class, 'store']);
            Route::get('/', [OrderController::class, 'getAllOrders']);
            Route::get('/{id}', [OrderController::class, 'show']);
            Route::get('/buyer-order/{id}', [OrderController::class, 'showBuyerOrder']);
            Route::get('/seller-order/{id}', [OrderController::class, 'showSellerOrder']);
        });

        Route::get('/login', function () {
            return response()->json(['message' => 'Unauthenticated'], 401);
        });
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
