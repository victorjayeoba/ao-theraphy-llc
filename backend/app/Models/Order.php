<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /**
     * paid      - Stripe confirmed the payment (set by the webhook, never by the browser)
     * ordered   - bought from Amazon Business, waiting on the supplier
     * shipped   - tracking known, customer notified
     * delivered - arrived
     * pending   - checkout started, not paid; abandoned - checkout expired
     */
    public const FULFILMENT_STATUSES = ['paid', 'ordered', 'shipped', 'delivered', 'cancelled'];

    protected $fillable = [
        'customer_id', 'number', 'email', 'name', 'address', 'city', 'zip', 'items',
        'subtotal', 'shipping', 'tax', 'total', 'card_last4', 'status',
        'stripe_session_id', 'stripe_payment_intent',
        'supplier_order_ref', 'carrier', 'tracking_number', 'admin_note',
        'shipped_at', 'delivered_at',
    ];

    protected $casts = [
        'items' => 'array',
        'subtotal' => 'float',
        'shipping' => 'float',
        'tax' => 'float',
        'total' => 'float',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /** What the customer is told, without exposing supplier details. */
    public function publicStatus(): string
    {
        return match ($this->status) {
            'paid' => 'Payment received',
            'ordered' => 'Preparing your order',
            'shipped' => 'On its way',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
            default => 'Awaiting payment',
        };
    }

    /** Best-effort tracking link; falls back to the number alone for unknown carriers. */
    public function trackingUrl(): ?string
    {
        if (! $this->tracking_number) {
            return null;
        }

        return match (strtolower((string) $this->carrier)) {
            'ups' => "https://www.ups.com/track?tracknum={$this->tracking_number}",
            'usps' => "https://tools.usps.com/go/TrackConfirmAction?tLabels={$this->tracking_number}",
            'fedex' => "https://www.fedex.com/fedextrack/?trknbr={$this->tracking_number}",
            'amazon' => 'https://www.amazon.com/progress-tracker/package',
            default => null,
        };
    }
}
