<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    //
    protected $table = 'achievements';

    protected $fillable = [
        'title',
        'description',
        'date',
        'picture'
    ];
}
