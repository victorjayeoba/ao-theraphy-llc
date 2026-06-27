<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The `category` column was added to `products` outside of a migration and
     * given a short length, so longer category names (e.g. "Core Strengthening
     * Tools", "ADLs (Self-care Tools)") overflowed it and caused SQLSTATE[22001]
     * "Data too long for column 'category'" on insert/update.
     *
     * This widens it to varchar(255) to match the controller's
     * `category => nullable|string|max:255` validation. On a fresh database
     * where the column was never created, it adds the column instead.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'category')) {
                $table->string('category', 255)->nullable()->change();
            } else {
                $table->string('category', 255)->nullable()->after('name');
            }
        });
    }

    public function down(): void
    {
        // No-op: we don't want to shrink the column back to a length that
        // would re-introduce the truncation bug. Leaving it as varchar(255).
    }
};
