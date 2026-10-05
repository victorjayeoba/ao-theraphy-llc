<?php

namespace Tests\Feature;

use App\Http\Controllers\CheckoutController;
use App\Mail\OrderAdminNotificationMail;
use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Models\Products;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ShopTest extends TestCase
{
    use RefreshDatabase;

    private const WEBHOOK_SECRET = 'whsec_test_secret';

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.stripe.webhook_secret' => self::WEBHOOK_SECRET]);
    }

    private function product(float $price): Products
    {
        return Products::create(['name' => 'Putty ' . $price, 'description' => 'x', 'price' => $price]);
    }

    private function pendingOrder(array $attrs = []): Order
    {
        return Order::create(array_merge([
            'number' => 'AO-TEST1234',
            'stripe_session_id' => 'cs_test_123',
            'email' => 'a@b.co',
            'name' => 'Jane',
            'items' => [['id' => 1, 'name' => 'Putty', 'price' => 20.0, 'quantity' => 2]],
            'subtotal' => 40.0, 'shipping' => 7.99, 'tax' => 0, 'total' => 47.99,
            'status' => 'pending',
        ], $attrs));
    }

    /** Builds the signature header Stripe sends, so the handler verifies it for real. */
    private function webhookPost(array $event): \Illuminate\Testing\TestResponse
    {
        $payload = json_encode($event);
        $timestamp = time();
        $signature = hash_hmac('sha256', "{$timestamp}.{$payload}", self::WEBHOOK_SECRET);

        return $this->call(
            'POST',
            '/api/stripe/webhook',
            [], [], [],
            ['HTTP_STRIPE_SIGNATURE' => "t={$timestamp},v1={$signature}", 'CONTENT_TYPE' => 'application/json'],
            $payload
        );
    }

    private function completedEvent(Order $order, string $type = 'checkout.session.completed'): array
    {
        return [
            'id' => 'evt_1', 'object' => 'event', 'type' => $type,
            'data' => ['object' => [
                'id' => $order->stripe_session_id,
                'object' => 'checkout.session',
                'payment_intent' => 'pi_test_123',
                'metadata' => ['order_id' => $order->id],
                'collected_information' => ['shipping_details' => ['address' => [
                    'line1' => '1 Main St', 'city' => 'Chicago', 'postal_code' => '60601',
                ]]],
            ]],
        ];
    }

    public function test_cart_is_priced_from_the_database_not_the_client(): void
    {
        $a = $this->product(20);
        $b = $this->product(5.5);

        // A price sent by the browser must be ignored; only id + quantity count.
        $priced = app(CheckoutController::class)->priceCart([
            ['id' => $a->id, 'quantity' => 2, 'price' => 0.01],
            ['id' => $b->id, 'quantity' => 1],
        ]);

        $this->assertSame(4550, $priced['subtotal']);   // cents
        $this->assertSame(799, $priced['shipping']);
        $this->assertArrayNotHasKey('tax', $priced);   // not registered to collect sales tax
        $this->assertSame(20.0, $priced['lines'][0]['price']);
    }

    public function test_free_shipping_at_threshold(): void
    {
        $at = app(CheckoutController::class)->priceCart([['id' => $this->product(75)->id, 'quantity' => 1]]);
        $under = app(CheckoutController::class)->priceCart([['id' => $this->product(74.99)->id, 'quantity' => 1]]);

        $this->assertSame(0, $at['shipping']);
        $this->assertSame(799, $under['shipping']);
    }

    public function test_checkout_rejects_unknown_products_and_empty_cart(): void
    {
        $base = ['email' => 'a@b.co', 'name' => 'Jane'];

        // Validation runs before Stripe is called, so no API key is needed here.
        $this->postJson('/api/checkout/session', $base + ['items' => [['id' => 999, 'quantity' => 1]]])
            ->assertUnprocessable();
        $this->postJson('/api/checkout/session', $base + ['items' => []])->assertUnprocessable();
        $this->postJson('/api/checkout/session', ['items' => [['id' => 1, 'quantity' => 1]]])
            ->assertUnprocessable();
    }

    public function test_webhook_marks_the_order_paid_and_emails_both_parties(): void
    {
        Mail::fake();
        $order = $this->pendingOrder();

        $this->webhookPost($this->completedEvent($order))->assertOk();

        $order->refresh();
        $this->assertSame('paid', $order->status);
        $this->assertSame('pi_test_123', $order->stripe_payment_intent);
        $this->assertSame('1 Main St', $order->address);   // address captured from Stripe
        $this->assertSame('60601', $order->zip);
        Mail::assertSent(OrderConfirmationMail::class, 1);
        Mail::assertSent(OrderAdminNotificationMail::class, 1);
    }

    public function test_replayed_webhook_does_not_email_twice(): void
    {
        Mail::fake();
        $order = $this->pendingOrder();
        $event = $this->completedEvent($order);

        // Stripe retries deliveries, so the same event can land more than once.
        $this->webhookPost($event)->assertOk();
        $this->webhookPost($event)->assertOk();

        Mail::assertSent(OrderConfirmationMail::class, 1);
        $this->assertSame(1, Order::where('status', 'paid')->count());
    }

    public function test_webhook_rejects_a_bad_signature_and_leaves_the_order_alone(): void
    {
        $order = $this->pendingOrder();

        $this->call(
            'POST', '/api/stripe/webhook', [], [], [],
            ['HTTP_STRIPE_SIGNATURE' => 't=1,v1=deadbeef', 'CONTENT_TYPE' => 'application/json'],
            json_encode($this->completedEvent($order))
        )->assertStatus(400);

        $this->postJson('/api/stripe/webhook', $this->completedEvent($order))->assertStatus(400);
        $this->assertSame('pending', $order->refresh()->status);
    }

    public function test_expired_session_marks_the_order_abandoned(): void
    {
        $order = $this->pendingOrder();

        $this->webhookPost($this->completedEvent($order, 'checkout.session.expired'))->assertOk();

        $this->assertSame('abandoned', $order->refresh()->status);
    }

    public function test_success_page_can_look_the_order_up_by_session(): void
    {
        $order = $this->pendingOrder();

        $this->getJson("/api/orders/by-session/{$order->stripe_session_id}")
            ->assertOk()
            ->assertJson(['number' => $order->number, 'status' => 'pending']);

        $this->getJson('/api/orders/by-session/cs_does_not_exist')->assertNotFound();
    }

    public function test_admin_sees_paid_orders_and_can_filter(): void
    {
        $paid = $this->pendingOrder(['status' => 'paid']);
        $pending = $this->pendingOrder(['number' => 'AO-PENDING1', 'stripe_session_id' => 'cs_test_456']);
        $admin = User::factory()->create();

        // Default view hides abandoned carts.
        $this->actingAs($admin)->get('/orders')
            ->assertOk()->assertSee($paid->number)->assertDontSee($pending->number);

        $this->actingAs($admin)->get('/orders?status=pending')
            ->assertOk()->assertSee($pending->number)->assertDontSee($paid->number);
    }

    public function test_admin_can_set_rating_and_api_returns_it(): void
    {
        $p = $this->product(10);
        $this->actingAs(User::factory()->create())
            ->patch("/products/{$p->id}", [
                'name' => $p->name, 'description' => 'x', 'price' => 10,
                'rating' => 4.6, 'review_count' => 128,
            ])->assertRedirect();

        $this->getJson("/api/products/{$p->fresh()->slug}")
            ->assertJson(['rating' => 4.6, 'review_count' => 128]);

        $this->actingAs(User::factory()->create())
            ->patch("/products/{$p->id}", ['name' => $p->name, 'description' => 'x', 'price' => 10, 'rating' => 6])
            ->assertSessionHasErrors('rating');
    }
}
