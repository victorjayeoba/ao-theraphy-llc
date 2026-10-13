<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CustomerAuthController;
use App\Http\Controllers\StripeWebhookController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Submit new support inquiry (POST)
Route::post('/support/inquiry', [SupportController::class, 'store']);

// Route::get('/support/inquiries', [SupportController::class, 'index']);
Route::get('/support/inquiries', [SupportController::class, 'showinquiries']);
Route::get('/support/inquiry/{id}', [SupportController::class, 'showInquiry']);

// Product API routes
Route::get('/products', [ProductController::class, 'showAllProducts']); // List all products (API)
Route::get('/products/{slug}', [ProductController::class, 'showProduct']); // Single product (API)

// Submit new consultation request (POST)
Route::post('/consultation', [ConsultationController::class, 'store']);
Route::get('/consultations', [ConsultationController::class, 'showConsultations']);
Route::get('/consultation/{id}', [ConsultationController::class, 'showConsultation']);


Route::get('/sessions', [SessionController::class, 'showSessionsAPI']);

Route::get('/achievements', [AchievementController::class, 'apiIndex']);

// Stripe Checkout: create the hosted payment session, then look the order up on return
Route::post('/checkout/session', [CheckoutController::class, 'createSession'])->middleware('throttle:10,1');
Route::get('/orders/by-session/{sessionId}', [CheckoutController::class, 'showBySession'])->middleware('throttle:60,1');

// Shop customer accounts. Throttled: these are the guessable endpoints.
Route::post('/customer/register', [CustomerAuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('/customer/login', [CustomerAuthController::class, 'login'])->middleware('throttle:10,1');
Route::middleware('auth:customer')->group(function () {
    Route::post('/customer/logout', [CustomerAuthController::class, 'logout']);
    Route::get('/customer/me', [CustomerAuthController::class, 'me']);
    Route::get('/customer/orders', [CustomerAuthController::class, 'orders']);
});

// Public order tracking: order number + the email it was placed with.
Route::post('/orders/track', [OrderController::class, 'track'])->middleware('throttle:20,1');

// Stripe calls this server-to-server; it is signature-verified, not authenticated.
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);
