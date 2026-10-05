<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Stripe\StripeClient;

/**
 * Stripe Checkout: creates the hosted payment session.
 *
 * Card details are entered on Stripe's page, never here. The order is created as `pending`
 * and is only marked `paid` by StripeWebhookController — the redirect back to the site is
 * not proof of payment.
 */
class CheckoutController extends Controller
{
    // Mirrors frontend/src/lib/payment.ts — keep the two in step.
    const FREE_SHIPPING_OVER = 75;
    const SHIPPING_FLAT = 7.99;
    const TAX_RATE = 0.07;

    public function createSession(Request $request)
    {
        $data = $request->validate([
            'email'            => 'required|email|max:255',
            'name'             => 'required|string|max:255',
            'items'            => 'required|array|min:1|max:50',
            'items.*.id'       => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1|max:99',
        ], [
            'items.*.id.exists' => 'An item in your cart is no longer available. Please remove it and try again.',
        ]);

        ['lines' => $lines, 'subtotal' => $subtotalCents, 'shipping' => $shippingCents, 'tax' => $taxCents]
            = $this->priceCart($data['items']);

        $order = Order::create([
            'number'   => 'AO-' . strtoupper(Str::random(8)),
            'email'    => $data['email'],
            'name'     => $data['name'],
            'items'    => $lines,
            'subtotal' => $subtotalCents / 100,
            'shipping' => $shippingCents / 100,
            'tax'      => $taxCents / 100,
            'total'    => ($subtotalCents + $shippingCents + $taxCents) / 100,
            'status'   => 'pending',
        ]);

        try {
            $session = $this->stripe()->checkout->sessions->create([
                'mode' => 'payment',
                'customer_email' => $order->email,
                'client_reference_id' => $order->number,
                'metadata' => ['order_id' => $order->id],
                'line_items' => $this->lineItems($lines, $taxCents),
                'shipping_options' => $shippingCents > 0 ? [[
                    'shipping_rate_data' => [
                        'type' => 'fixed_amount',
                        'display_name' => 'Standard shipping',
                        'fixed_amount' => ['amount' => $shippingCents, 'currency' => 'usd'],
                    ],
                ]] : [],
                // Stripe collects the delivery address on its page, so we don't ask for it twice.
                'shipping_address_collection' => ['allowed_countries' => ['US']],
                'success_url' => rtrim(config('app.frontend_url'), '/') . '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url'  => rtrim(config('app.frontend_url'), '/') . '/checkout?cancelled=1',
                'expires_at' => now()->addHour()->timestamp,
            ]);
        } catch (\Throwable $e) {   // Stripe throws several types; a down network throws others still
            // Stripe's message names api keys and internal fields; the customer gets a plain
            // sentence and we keep the detail in the log. The half-made order goes too.
            Log::error("Stripe session failed for order {$order->number}: " . $e->getMessage());
            $order->delete();

            return response()->json([
                'message' => "We couldn't start the payment just now. Please try again in a moment.",
            ], 502);
        }

        $order->update(['stripe_session_id' => $session->id]);

        return response()->json(['url' => $session->url, 'number' => $order->number]);
    }

    /** Order lookup for the success page. Public by design: the session id is the secret. */
    public function showBySession(string $sessionId)
    {
        $order = Order::where('stripe_session_id', $sessionId)->firstOrFail();

        return response()->json([
            'number' => $order->number,
            'status' => $order->status,
            'total'  => $order->total,
            'email'  => $order->email,
        ]);
    }

    /**
     * Re-prices the cart from the database and returns integer cents.
     *
     * The client sends ids and quantities only; any price it sent would be ignored. Cents
     * rather than floats so totals can't drift by a penny on the way to Stripe.
     */
    public function priceCart(array $items): array
    {
        $products = Products::whereIn('id', array_column($items, 'id'))->get()->keyBy('id');

        $lines = [];
        $subtotalCents = 0;
        foreach ($items as $item) {
            $p = $products[$item['id']];
            $unitCents = (int) round($p->price * 100);
            $lines[] = [
                'id'       => $p->id,
                'name'     => $p->name,
                'price'    => round($unitCents / 100, 2),
                'quantity' => $item['quantity'],
            ];
            $subtotalCents += $unitCents * $item['quantity'];
        }

        return [
            'lines'    => $lines,
            'subtotal' => $subtotalCents,
            'shipping' => $subtotalCents >= self::FREE_SHIPPING_OVER * 100 ? 0 : (int) round(self::SHIPPING_FLAT * 100),
            'tax'      => (int) round($subtotalCents * self::TAX_RATE),
        ];
    }

    /** Tax rides as its own line so the Stripe page totals match ours to the cent. */
    private function lineItems(array $lines, int $taxCents): array
    {
        $items = [];
        foreach ($lines as $line) {
            $items[] = [
                'quantity' => $line['quantity'],
                'price_data' => [
                    'currency' => 'usd',
                    'unit_amount' => (int) round($line['price'] * 100),
                    'product_data' => ['name' => $line['name']],
                ],
            ];
        }

        if ($taxCents > 0) {
            $items[] = [
                'quantity' => 1,
                'price_data' => [
                    'currency' => 'usd',
                    'unit_amount' => $taxCents,
                    'product_data' => ['name' => 'Sales tax (7%)'],
                ],
            ];
        }

        return $items;
    }

    private function stripe(): StripeClient
    {
        return new StripeClient(config('services.stripe.secret'));
    }
}
