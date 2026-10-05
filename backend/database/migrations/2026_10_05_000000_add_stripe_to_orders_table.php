<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Moves orders onto Stripe Checkout.
 *
 * Orders now start as `pending` and are only marked `paid` by the Stripe webhook, so the
 * session id is needed to find the order again both from the webhook and from the success page.
 * Delivery details are no longer collected before payment, so those columns become nullable.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('stripe_session_id')->nullable()->unique()->after('number');
            $table->string('stripe_payment_intent')->nullable()->after('stripe_session_id');
            $table->string('status')->default('pending')->change();
            $table->string('address')->nullable()->change();
            $table->string('city')->nullable()->change();
            $table->string('zip', 10)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['stripe_session_id', 'stripe_payment_intent']);
            $table->string('status')->default('paid')->change();
        });
    }
};
