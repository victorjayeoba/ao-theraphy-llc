<?php

namespace Tests\Feature;

use App\Models\Products;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopTest extends TestCase
{
    use RefreshDatabase;

    private function product(float $price): Products
    {
        return Products::create(['name' => 'Putty ' . $price, 'description' => 'x', 'price' => $price]);
    }

    private function order(array $items): array
    {
        return [
            'email' => 'a@b.co', 'name' => 'Jane', 'address' => '1 Main St',
            'city' => 'Chicago', 'zip' => '60601', 'card_last4' => '4242', 'items' => $items,
        ];
    }

    public function test_order_uses_database_prices_and_computes_totals(): void
    {
        $a = $this->product(20);
        $b = $this->product(5.5);

        // Client-sent prices are ignored; only id + quantity matter.
        $res = $this->postJson('/api/orders', $this->order([
            ['id' => $a->id, 'quantity' => 2, 'price' => 0.01],
            ['id' => (string) $b->id, 'quantity' => 1],
        ]))->assertCreated();

        $this->assertEquals(45.5, $res['subtotal']);
        $this->assertEquals(7.99, $res['shipping']);
        $this->assertEquals(3.19, $res['tax']);
        $this->assertEquals(56.68, $res['total']);
        $this->assertDatabaseCount('orders', 1);

        $this->actingAs(User::factory()->create())->get('/orders')
            ->assertOk()->assertSee($res['number'])->assertSee('56.68');
        $this->get('/products')->assertOk()->assertSee('Rating');
    }

    public function test_free_shipping_at_threshold(): void
    {
        $a = $this->product(75);
        $res = $this->postJson('/api/orders', $this->order([['id' => $a->id, 'quantity' => 1]]))->assertCreated();
        $this->assertEquals(0, $res['shipping']);
    }

    public function test_rejects_unknown_products_and_empty_cart(): void
    {
        $this->postJson('/api/orders', $this->order([['id' => 999, 'quantity' => 1]]))->assertUnprocessable();
        $this->postJson('/api/orders', $this->order([]))->assertUnprocessable();
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
