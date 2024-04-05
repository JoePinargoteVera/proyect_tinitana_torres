<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero',
        'fecha',
        'hora',
        'subtotal',
        'descuento',
        'iva',
        'total',
    ];

    public function transaccion()
    {
        return $this->belongsTo(Transaction::class, 'transaccion_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
