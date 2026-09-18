<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'number', 'email', 'name', 'address', 'city', 'zip', 'items',
        'subtotal', 'shipping', 'tax', 'total', 'card_last4', 'status',
    ];

    protected $casts = [
        'items' => 'array',
        'subtotal' => 'float',
        'shipping' => 'float',
        'tax' => 'float',
        'total' => 'float',
    ];
}
