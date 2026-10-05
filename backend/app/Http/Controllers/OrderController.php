<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Admin: list orders. Defaults to paid — every started checkout leaves a pending row
    // behind, and abandoned carts would otherwise bury the real orders.
    public function index(Request $request)
    {
        $status = $request->query('status', 'paid');
        $orders = Order::when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->latest()
            ->get();

        return view('orders', compact('orders', 'status'));
    }
}
