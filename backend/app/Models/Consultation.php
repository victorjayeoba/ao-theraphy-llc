<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    //
    protected $table = 'consultations';
    
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'preferred_date',
        'preferred_time',
        'session_type',
        'needs',
    ];
}
