<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Products extends Model
{
    use HasFactory;
    protected $table = 'products';

    protected $fillable = [
        'name',
        'category',
        'description',
        'price',
        'picture',
        'slug',
    ];

    protected static function boot()
    {
        parent::boot();
        // Create slug when product is created
        static::creating(function ($product) {
            $product->slug = self::generateUniqueSlug($product->name);
        });
        // Update slug when name changes
        static::updating(function ($product) {
            if ($product->isDirty('name')) {
                $product->slug = self::generateUniqueSlug($product->name, $product->id);
            }
        });
    }
    /**

     * Generate unique slug for product name

     */
    public static function generateUniqueSlug($name, $excludeId = null)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        // Make sure slug is unique
        while (
            self::where('slug', $slug)
                ->when($excludeId, function ($query) use ($excludeId) {
                    $query->where('id', '!=', $excludeId);
                })
                ->exists()
        ) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }
        return $slug;
    }
}

