<?php

namespace Tests\Feature;

use App\Mail\OrderShippedMail;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class FulfilmentTest extends TestCase
{
    use RefreshDatabase;

    private function paidOrder(array $attrs = []): Order
    {
        return Order::create(array_merge([
            'number' => 'AO-TRACK001',
            'stripe_session_id' => 'cs_test_track',
            'email' => 'buyer@example.com',
            'name' => 'Jane Buyer',
            'address' => '1 Main St', 'city' => 'Chicago', 'zip' => '60601',
            'items' => [['id' => 1, 'name' => 'Putty', 'price' => 20.0, 'quantity' => 2]],
            'subtotal' => 40.0, 'shipping' => 7.99, 'tax' => 0, 'total' => 47.99,
            'status' => 'paid',
        ], $attrs));
    }

    private function fulfil(Order $order, array $data)
    {
        return $this->actingAs(User::factory()->create())
            ->patch("/orders/{$order->id}", $data);
    }

    public function test_marking_shipped_records_tracking_and_emails_the_customer(): void
    {
        Mail::fake();
        $order = $this->paidOrder();

        $this->fulfil($order, [
            'status' => 'shipped',
            'supplier_order_ref' => '114-1234567-1234567',
            'carrier' => 'UPS',
            'tracking_number' => '1Z999AA10123456784',
        ])->assertRedirect();

        $order->refresh();
        $this->assertSame('shipped', $order->status);
        $this->assertSame('1Z999AA10123456784', $order->tracking_number);
        $this->assertNotNull($order->shipped_at);
        Mail::assertSent(OrderShippedMail::class, 1);
    }

    public function test_editing_an_already_shipped_order_does_not_email_again(): void
    {
        Mail::fake();
        $order = $this->paidOrder();

        $this->fulfil($order, ['status' => 'shipped', 'carrier' => 'UPS', 'tracking_number' => 'WRONG']);
        // Fixing a typo in the tracking number must not spam the customer a second time.
        $this->fulfil($order, ['status' => 'shipped', 'carrier' => 'UPS', 'tracking_number' => 'RIGHT']);

        Mail::assertSent(OrderShippedMail::class, 1);
        $this->assertSame('RIGHT', $order->refresh()->tracking_number);
    }

    public function test_earlier_statuses_do_not_email(): void
    {
        Mail::fake();
        $order = $this->paidOrder();

        $this->fulfil($order, ['status' => 'ordered', 'supplier_order_ref' => '114-999']);

        Mail::assertNothingSent();
        $this->assertSame('ordered', $order->refresh()->status);
    }

    public function test_fulfilment_requires_login_and_a_known_status(): void
    {
        $order = $this->paidOrder();

        $this->patch("/orders/{$order->id}", ['status' => 'shipped'])->assertRedirect('/login');
        $this->fulfil($order, ['status' => 'teleported'])->assertSessionHasErrors('status');
        $this->assertSame('paid', $order->refresh()->status);
    }

    public function test_customer_can_track_with_number_and_email(): void
    {
        $order = $this->paidOrder(['status' => 'shipped', 'carrier' => 'USPS', 'tracking_number' => '94001']);

        $this->postJson('/api/orders/track', ['number' => 'ao-track001', 'email' => 'BUYER@example.com'])
            ->assertOk()
            ->assertJson([
                'number' => 'AO-TRACK001',
                'status' => 'shipped',
                'status_label' => 'On its way',
                'tracking' => '94001',
            ])
            ->assertJsonMissing(['supplier_order_ref' => '114-1234567-1234567']);
    }

    public function test_tracking_needs_the_matching_email(): void
    {
        $this->paidOrder();

        // Same message either way, so this can't be used to discover order numbers.
        $wrongEmail = $this->postJson('/api/orders/track', ['number' => 'AO-TRACK001', 'email' => 'nope@example.com']);
        $wrongNumber = $this->postJson('/api/orders/track', ['number' => 'AO-NOPE', 'email' => 'buyer@example.com']);

        $wrongEmail->assertNotFound();
        $wrongNumber->assertNotFound();
        $this->assertSame($wrongEmail->json('message'), $wrongNumber->json('message'));
    }

    public function test_unpaid_orders_are_not_trackable(): void
    {
        $this->paidOrder(['status' => 'pending']);

        $this->postJson('/api/orders/track', ['number' => 'AO-TRACK001', 'email' => 'buyer@example.com'])
            ->assertNotFound();
    }

    public function test_internal_notes_never_reach_the_customer(): void
    {
        $order = $this->paidOrder(['status' => 'ordered']);
        $this->fulfil($order, [
            'status' => 'ordered',
            'supplier_order_ref' => '114-SECRET',
            'admin_note' => 'bought on Liz account, margin thin',
        ]);

        $body = $this->postJson('/api/orders/track', [
            'number' => 'AO-TRACK001', 'email' => 'buyer@example.com',
        ])->assertOk()->getContent();

        $this->assertStringNotContainsString('114-SECRET', $body);
        $this->assertStringNotContainsString('margin thin', $body);
    }
}
