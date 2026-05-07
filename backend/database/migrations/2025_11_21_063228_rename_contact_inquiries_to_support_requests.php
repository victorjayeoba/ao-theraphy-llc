<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    

    public function up(): void
    {
        if (Schema::hasTable('contact_inquiries') && !Schema::hasTable('support')) {
            Schema::rename('contact_inquiries', 'support');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('support') && !Schema::hasTable('contact_inquiries')) {
            Schema::rename('support', 'contact_inquiries');
        }
    }

};
