<?php

namespace App\Http\Controllers;

use App\Mail\OrderShippedMail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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

    /**
     * Admin: record fulfilment progress — the Amazon order reference, the tracking number,
     * and where the order has got to.
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'status'             => 'required|in:' . implode(',', Order::FULFILMENT_STATUSES),
            'supplier_order_ref' => 'nullable|string|max:120',
            'carrier'            => 'nullable|string|max:60',
            'tracking_number'    => 'nullable|string|max:120',
            'admin_note'         => 'nullable|string|max:2000',
        ]);

        $order = Order::findOrFail($id);
        $wasShipped = $order->status === 'shipped';

        $order->fill($data);
        if ($order->status === 'shipped' && ! $order->shipped_at) {
            $order->shipped_at = now();
        }
        if ($order->status === 'delivered' && ! $order->delivered_at) {
            $order->delivered_at = now();
        }
        $order->save();

        // Tell the customer the moment it ships, but only once — editing a shipped order
        // again (fixing a typo in the tracking number) must not re-email them.
        $notified = false;
        if ($order->status === 'shipped' && ! $wasShipped) {
            $notified = $this->sendShippedEmail($order);
        }

        return back()->with('success', $notified
            ? "Order {$order->number} updated and the customer has been emailed the tracking."
            : "Order {$order->number} updated.");
    }

    private function sendShippedEmail(Order $order): bool
    {
        try {
            Mail::to($order->email)->send(new OrderShippedMail($order));
            return true;
        } catch (\Throwable $e) {
            Log::error("Order {$order->number}: shipped email failed — " . $e->getMessage());
            return false;
        }
    }

    /**
     * Public order tracking: order number + the email it was placed with.
     *
     * Both are required together. The number alone is guessable enough that it should not
     * expose someone's name and address, and the pairing keeps this usable for customers
     * who never made an account. Throttled in the route.
     */
    public function track(Request $request)
    {
        $data = $request->validate([
            'number' => 'required|string|max:40',
            'email'  => 'required|email|max:255',
        ]);

        $order = Order::whereRaw('LOWER(number) = ?', [strtolower(trim($data['number']))])
            ->whereRaw('LOWER(email) = ?', [strtolower(trim($data['email']))])
            ->whereIn('status', Order::FULFILMENT_STATUSES)   // unpaid orders aren't trackable
            ->first();

        // One message for "wrong number" and "wrong email" alike, so this can't be used to
        // test whether an order number exists.
        if (! $order) {
            return response()->json([
                'message' => "We couldn't find an order with that number and email.",
            ], 404);
        }

        return response()->json($this->publicPayload($order));
    }

    /** Only what the customer should see — no supplier reference, no internal notes. */
    private function publicPayload(Order $order): array
    {
        return [
            'number'        => $order->number,
            'status'        => $order->status,
            'status_label'  => $order->publicStatus(),
            'placed_at'     => $order->created_at->toDateString(),
            'items'         => $order->items,
            'subtotal'      => $order->subtotal,
            'shipping'      => $order->shipping,
            'total'         => $order->total,
            'carrier'       => $order->carrier,
            'tracking'      => $order->tracking_number,
            'tracking_url'  => $order->trackingUrl(),
            'shipped_at'    => $order->shipped_at?->toDateString(),
            'delivered_at'  => $order->delivered_at?->toDateString(),
        ];
    }
}
