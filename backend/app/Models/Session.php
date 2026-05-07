<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $table = 'con_sessions';

    protected $fillable = [
        'type',
        'name',
        'duration',
        'price',
        'description',
        'features',
    ];

    protected $casts = [
        'features' => 'array',
    ];
}
