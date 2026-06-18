<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Seed the categories table.
     *
     * Order matches the admin "Edit Product" dropdown. updateOrInsert keeps
     * this idempotent — existing categories are left untouched, new ones added.
     */
    public function run(): void
    {
        $categories = [
            'Sensory Tools',
            'Fine Motor',
            'Movement Tools',
            'Calming Tools',
            'Cognitive Support',
            'ADLs (Self-care Tools)',
            'Gross Motor Tools',
            'Visual Motor Tools',
            'Core Strengthening Tools',
            'Motor/Orthopedic Tools',
            'Handwriting Adaptive Tools',
            'Hearing/Visual Impairment Tools',
        ];

        // The categories table is just (id, name) — no timestamp columns —
        // so updateOrInsert with an empty attribute set simply ensures the row exists.
        foreach ($categories as $name) {
            DB::table('categories')->updateOrInsert(['name' => $name], []);
        }
    }
}
