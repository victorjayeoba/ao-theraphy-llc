<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Fulfilment tracking.
 *
 * Products are bought from Amazon Business once a customer has paid, so an order moves
 * paid -> ordered (bought on Amazon) -> shipped (tracking known) -> delivered. The supplier
 * reference is the Amazon order number, kept so a delivery can be chased later.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('supplier_order_ref')->nullable()->after('stripe_payment_intent');
            $table->string('carrier')->nullable()->after('supplier_order_ref');
            $table->string('tracking_number')->nullable()->after('carrier');
            $table->text('admin_note')->nullable()->after('tracking_number');
            $table->timestamp('shipped_at')->nullable()->after('admin_note');
            $table->timestamp('delivered_at')->nullable()->after('shipped_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'supplier_order_ref', 'carrier', 'tracking_number',
                'admin_note', 'shipped_at', 'delivered_at',
            ]);
        });
    }
};
