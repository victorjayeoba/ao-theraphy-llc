<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashBoardController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\SessionController;

Route::get('/', function () {
    return redirect()->route('login');
});

// 🔐 Authentication Routes (NO middleware)
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');


// ✅ PROTECTED ROUTES (Only logged-in users can access)
Route::middleware(['auth'])->group(function () {

    // 🏠 Dashboard
    Route::get('/dashboard', [DashBoardController::class, 'dashboard'])->name('dashboard');

    // Support Inquiries
    Route::get('/supportview/inquiries', [SupportController::class, 'showinquiries'])->name('support.inquiries');
    Route::get('/support/inquiry/{id}', [SupportController::class, 'showInquiry'])->name('support.inquiry');
    Route::post('/support/inquiry/{id}/activate', [SupportController::class, 'activateInquiry'])->name('support.inquiry.activate');
    Route::get('/support', [SupportController::class, 'index'])->name('support');

    // Product CRUD (web)
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{id}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::match(['put', 'patch'], '/products/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Consultations Management
    Route::get('/consultations', [App\Http\Controllers\ConsultationController::class, 'index'])->name('consultations.index');
    Route::get('/consultations/{id}', [App\Http\Controllers\ConsultationController::class, 'show'])->name('consultations.show');
    Route::delete('/consultations/{id}', [App\Http\Controllers\ConsultationController::class, 'destroy'])->name('consultations.destroy');

    // Sessions Management
    Route::get('/sessions', [App\Http\Controllers\SessionController::class, 'showSessions'])->name('sessions.index');
    Route::post('/sessions/add', [App\Http\Controllers\SessionController::class, 'addSessionFromWeb'])->name('sessions.store');
    Route::get('/sessions/edit/{id}', [App\Http\Controllers\SessionController::class, 'editsession'])->name('sessions.edit');
    Route::match(['post', 'put'], '/sessions/{id}', [App\Http\Controllers\SessionController::class, 'updateSession'])->name('sessions.update');
    Route::delete('/sessions/delete/{id}', [App\Http\Controllers\SessionController::class, 'deletesession'])->name('sessions.destroy');

    // Achievements
    Route::get('/achievements', [App\Http\Controllers\AchievementController::class, 'index'])->name('achievements.index');
    Route::get('/achievements/list', [App\Http\Controllers\AchievementController::class, 'index'])->name('achievements.list');
    Route::post('/achievements/store', [App\Http\Controllers\AchievementController::class, 'store'])->name('achievements.store');
    Route::get('/achievements/edit/{id}', [App\Http\Controllers\AchievementController::class, 'edit'])->name('achievements.edit');
    Route::match(['post', 'put'], '/achievements/{id}', [App\Http\Controllers\AchievementController::class, 'update'])->name('achievements.update');
    Route::delete('/achievements/delete/{id}', [App\Http\Controllers\AchievementController::class, 'destroy'])->name('achievements.destroy');

    // Change Password
    Route::get('/change-password', [AuthController::class, 'showChangePasswordForm'])->middleware('auth')->name('password.change.form');
    Route::post('/change-password', [AuthController::class, 'changePassword'])->middleware('auth')->name('password.change');

});
