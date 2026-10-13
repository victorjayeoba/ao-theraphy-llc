<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

/**
 * Shop customer accounts, authenticated with Sanctum bearer tokens.
 *
 * Separate from AuthController, which is the admin dashboard session login. A customer
 * token is only ever accepted by the `auth:customer` guard, so it cannot reach the dashboard.
 */
class CustomerAuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:customers,email',
            // No confirm field on the form; min 8 is the floor, Laravel hashes it on save.
            'password' => ['required', Password::min(8)],
        ]);

        $customer = Customer::create($data);

        return response()->json([
            'customer' => $this->publicCustomer($customer),
            'token'    => $customer->createToken('shop')->plainTextToken,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email|max:255',
            'password' => 'required|string',
        ]);

        $customer = Customer::where('email', $data['email'])->first();

        // One message for an unknown email and a wrong password alike, so this can't be
        // used to find out who has an account here.
        if (! $customer || ! Hash::check($data['password'], $customer->password)) {
            throw ValidationException::withMessages([
                'email' => 'Those details don\'t match an account.',
            ]);
        }

        return response()->json([
            'customer' => $this->publicCustomer($customer),
            'token'    => $customer->createToken('shop')->plainTextToken,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();   // this device only

        return response()->json(['message' => 'Signed out.']);
    }

    public function me(Request $request)
    {
        return response()->json($this->publicCustomer($request->user()));
    }

    /**
     * Orders placed while signed in.
     *
     * Matched on customer_id only, never on email: anyone can register with any address, so
     * email matching would hand them someone else's order history. Guest orders stay
     * reachable through the order-number + email tracking page.
     */
    public function orders(Request $request)
    {
        $orders = $request->user()->orders()
            ->whereIn('status', Order::FULFILMENT_STATUSES)
            ->latest()
            ->get()
            ->map(fn (Order $o) => [
                'number'       => $o->number,
                'status'       => $o->status,
                'status_label' => $o->publicStatus(),
                'placed_at'    => $o->created_at->toDateString(),
                'items'        => $o->items,
                'total'        => $o->total,
                'carrier'      => $o->carrier,
                'tracking'     => $o->tracking_number,
                'tracking_url' => $o->trackingUrl(),
            ]);

        return response()->json(['orders' => $orders]);
    }

    private function publicCustomer(Customer $customer): array
    {
        return [
            'id'    => $customer->id,
            'name'  => $customer->name,
            'email' => $customer->email,
        ];
    }
}
