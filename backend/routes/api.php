<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\AchievementController;

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