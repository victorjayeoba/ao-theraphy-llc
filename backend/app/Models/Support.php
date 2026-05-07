<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Support extends Model
{
    //
    use HasFactory;

    protected $table = 'support';

    protected $fillable = [
        'full_name', 'email', 'subject', 'message', 'is_active', 'phone_number', 'preferred_contact_method'
    ];
}
