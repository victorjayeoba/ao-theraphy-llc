<?php

namespace App\Http\Controllers;

use App\Mail\OrderAdminNotificationMail;
use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

/**
 * The only place an order is marked paid.
 *
 * Stripe calls this server-to-server and signs the request, so unlike the browser redirect it
 * cannot be faked or skipped by closing the tab. Three rules hold this together:
 *   1. Verify the signature on the RAW body before trusting anything in it.
 *   2. Be idempotent — Stripe retries, and the same event can arrive more than once.
 *   3. Always answer 200 once the payment is recorded; a non-200 makes Stripe retry, and a
 *      failed confirmation email is not a reason to replay a payment.
 */
class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $secret = config('services.stripe.webhook_secret');
        if (! $secret) {
            Log::error('Stripe webhook secret is not configured; refusing the event.');
            return response('Webhook not configured', 500);
        }

        try {
            $event = Webhook::constructEvent(
                $request->getContent(),                     // raw body: a parsed array won't verify
                $request->header('Stripe-Signature', ''),
                $secret
            );
        } catch (SignatureVerificationException | \UnexpectedValueException $e) {
            // Without this check anyone who found the URL could mark orders paid.
            Log::warning('Rejected Stripe webhook: ' . $e->getMessage());
            return response('Invalid signature', 400);
        }

        match ($event->type) {
            'checkout.session.completed' => $this->fulfil($event->data->object),
            'checkout.session.expired'   => $this->abandon($event->data->object),
            default => null,
        };

        return response('OK', 200);
    }

    private function fulfil($session): void
    {
        $order = $this->findOrder($session);
        if (! $order) {
            Log::warning('Stripe webhook: no order for session ' . ($session->id ?? '?'));
            return;
        }

        if ($order->status === 'paid') {
            return; // replayed event: already handled, do not email twice
        }

        $order->update([
            'status' => 'paid',
            'stripe_payment_intent' => $session->payment_intent ?? null,
            ...$this->shippingFrom($session),
        ]);

        $this->sendEmails($order);
    }

    private function abandon($session): void
    {
        $order = $this->findOrder($session);
        if ($order && $order->status === 'pending') {
            $order->update(['status' => 'abandoned']);
        }
    }

    private function findOrder($session): ?Order
    {
        $id = $session->metadata->order_id ?? null;

        return $id
            ? Order::find($id)
            : Order::where('stripe_session_id', $session->id ?? '')->first();
    }

    /** Stripe collected the delivery address on its page; keep it with the order. */
    private function shippingFrom($session): array
    {
        $details = $session->collected_information->shipping_details
            ?? $session->shipping_details
            ?? null;
        $address = $details->address ?? null;
        if (! $address) {
            return [];
        }

        return array_filter([
            'address' => trim(($address->line1 ?? '') . ' ' . ($address->line2 ?? '')) ?: null,
            'city'    => $address->city ?? null,
            'zip'     => $address->postal_code ?? null,
        ]);
    }

    /** Email failures are logged, never thrown: the payment already happened. */
    private function sendEmails(Order $order): void
    {
        try {
            Mail::to($order->email)->send(new OrderConfirmationMail($order));
        } catch (\Throwable $e) {
            Log::error("Order {$order->number}: confirmation email failed — " . $e->getMessage());
        }

        $admin = env('MAIL_ADMIN_ADDRESS');
        if ($admin) {
            try {
                Mail::to($admin)->send(new OrderAdminNotificationMail($order));
            } catch (\Throwable $e) {
                Log::error("Order {$order->number}: admin email failed — " . $e->getMessage());
            }
        }
    }
}
