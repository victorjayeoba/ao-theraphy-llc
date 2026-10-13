<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CustomerAccountTest extends TestCase
{
    use RefreshDatabase;

    private function customer(string $email = 'jane@example.com'): Customer
    {
        return Customer::create([
            'name' => 'Jane Buyer', 'email' => $email, 'password' => 'correct-horse',
        ]);
    }

    private function orderFor(?Customer $c, array $attrs = []): Order
    {
        return Order::create(array_merge([
            'customer_id' => $c?->id,
            'number' => 'AO-' . strtoupper(substr(md5(random_bytes(8)), 0, 8)),
            'email' => $c?->email ?? 'guest@example.com',
            'name' => 'Jane Buyer',
            'items' => [['id' => 1, 'name' => 'Putty', 'price' => 20.0, 'quantity' => 1]],
            'subtotal' => 20.0, 'shipping' => 7.99, 'tax' => 0, 'total' => 27.99,
            'status' => 'paid',
        ], $attrs));
    }

    public function test_register_returns_a_token_and_hashes_the_password(): void
    {
        $res = $this->postJson('/api/customer/register', [
            'name' => 'Jane Buyer', 'email' => 'jane@example.com', 'password' => 'correct-horse',
        ])->assertCreated()->assertJsonPath('customer.email', 'jane@example.com');

        $this->assertNotEmpty($res['token']);
        $stored = Customer::first()->password;
        $this->assertNotSame('correct-horse', $stored);
        $this->assertTrue(Hash::check('correct-horse', $stored));
        $this->assertArrayNotHasKey('password', $res['customer']);
    }

    public function test_register_rejects_duplicates_and_short_passwords(): void
    {
        $this->customer();

        $this->postJson('/api/customer/register', [
            'name' => 'Imposter', 'email' => 'jane@example.com', 'password' => 'another-one',
        ])->assertUnprocessable()->assertJsonValidationErrors('email');

        $this->postJson('/api/customer/register', [
            'name' => 'Shorty', 'email' => 'new@example.com', 'password' => 'short',
        ])->assertUnprocessable()->assertJsonValidationErrors('password');
    }

    public function test_login_succeeds_and_wrong_details_say_the_same_thing(): void
    {
        $this->customer();

        $this->postJson('/api/customer/login', ['email' => 'jane@example.com', 'password' => 'correct-horse'])
            ->assertOk()->assertJsonPath('customer.name', 'Jane Buyer');

        $wrongPassword = $this->postJson('/api/customer/login', ['email' => 'jane@example.com', 'password' => 'nope']);
        $noAccount = $this->postJson('/api/customer/login', ['email' => 'ghost@example.com', 'password' => 'nope']);

        // Identical message, so login can't be used to discover who has an account.
        $wrongPassword->assertUnprocessable();
        $noAccount->assertUnprocessable();
        $this->assertSame(
            $wrongPassword->json('errors.email'),
            $noAccount->json('errors.email')
        );
    }

    public function test_order_history_is_private_to_the_account(): void
    {
        $jane = $this->customer();
        $bob = $this->customer('bob@example.com');
        $janes = $this->orderFor($jane);
        $bobs = $this->orderFor($bob);
        $guest = $this->orderFor(null);

        $body = $this->actingAs($jane, 'customer')->getJson('/api/customer/orders')
            ->assertOk()->getContent();

        $this->assertStringContainsString($janes->number, $body);
        $this->assertStringNotContainsString($bobs->number, $body);
        $this->assertStringNotContainsString($guest->number, $body);
    }

    public function test_someone_registering_with_your_email_sees_nothing(): void
    {
        // Guest order placed with an email address. Registering that address later must not
        // hand the new account the old order: anyone can type anyone's email.
        $guestOrder = $this->orderFor(null, ['email' => 'victim@example.com']);
        $imposter = Customer::create([
            'name' => 'Imposter', 'email' => 'victim@example.com', 'password' => 'correct-horse',
        ]);

        $this->actingAs($imposter, 'customer')->getJson('/api/customer/orders')
            ->assertOk()->assertJsonCount(0, 'orders');
    }

    public function test_account_endpoints_need_a_token(): void
    {
        $this->getJson('/api/customer/orders')->assertUnauthorized();
        $this->getJson('/api/customer/me')->assertUnauthorized();
        $this->postJson('/api/customer/logout')->assertUnauthorized();
    }

    public function test_a_customer_token_cannot_reach_the_admin_dashboard(): void
    {
        $customer = $this->customer();
        $token = $customer->createToken('shop')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->get('/orders')
            ->assertRedirect('/login');   // admin is session-auth on the web guard
    }

    public function test_admin_cannot_use_their_session_on_customer_endpoints(): void
    {
        $this->actingAs(User::factory()->create())    // web guard
            ->getJson('/api/customer/orders')
            ->assertUnauthorized();
    }

    public function test_logout_revokes_only_that_token(): void
    {
        $customer = $this->customer();
        $phone = $customer->createToken('shop')->plainTextToken;
        $laptop = $customer->createToken('shop')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$phone}")->postJson('/api/customer/logout')->assertOk();

        // Requests in one test share a container, and the guard caches whoever it resolved
        // first. Real requests each get a fresh app, so forget the guards to match that.
        $this->app['auth']->forgetGuards();
        $this->withHeader('Authorization', "Bearer {$phone}")->getJson('/api/customer/me')->assertUnauthorized();

        $this->app['auth']->forgetGuards();
        $this->withHeader('Authorization', "Bearer {$laptop}")->getJson('/api/customer/me')->assertOk();
    }
}
