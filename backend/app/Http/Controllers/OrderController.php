<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    // Mirrors frontend/src/lib/payment.ts — keep the two in step.
    const FREE_SHIPPING_OVER = 75;
    const SHIPPING_FLAT = 7.99;
    const TAX_RATE = 0.07;

    // Admin: list orders
    public function index()
    {
        $orders = Order::latest()->get();
        return view('orders', compact('orders'));
    }

    // API: place an order. No gateway yet, so it is recorded as paid.
    public function store(Request $request)
    {
        $data = $request->validate([
            'email'            => 'required|email|max:255',
            'name'             => 'required|string|max:255',
            'address'          => 'required|string|max:255',
            'city'             => 'required|string|max:255',
            'zip'              => ['required', 'regex:/^\d{5}(-\d{4})?$/'],
            'card_last4'       => 'nullable|digits:4',
            'items'            => 'required|array|min:1|max:50',
            'items.*.id'       => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1|max:99',
        ], [
            'items.*.id.exists' => 'An item in your cart is no longer available. Please remove it and try again.',
        ]);

        // Prices come from the database, never from the client.
        $products = Products::whereIn('id', array_column($data['items'], 'id'))->get()->keyBy('id');
        $lines = [];
        $subtotal = 0;
        foreach ($data['items'] as $item) {
            $p = $products[$item['id']];
            $lines[] = [
                'id' => $p->id,
                'name' => $p->name,
                'price' => (float) $p->price,
                'quantity' => $item['quantity'],
            ];
            $subtotal += $p->price * $item['quantity'];
        }

        $subtotal = round($subtotal, 2);
        $shipping = $subtotal >= self::FREE_SHIPPING_OVER ? 0 : self::SHIPPING_FLAT;
        $tax = round($subtotal * self::TAX_RATE, 2);

        $order = Order::create([
            'number' => 'AO-' . strtoupper(Str::random(8)),
            'email' => $data['email'],
            'name' => $data['name'],
            'address' => $data['address'],
            'city' => $data['city'],
            'zip' => $data['zip'],
            'card_last4' => $data['card_last4'] ?? null,
            'items' => $lines,
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => round($subtotal + $shipping + $tax, 2),
        ]);

        return response()->json($order, 201);
    }
}
