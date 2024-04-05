<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsedProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'cantidad_actual',
        'cantidad_total',
        'estado',
    ];
}
