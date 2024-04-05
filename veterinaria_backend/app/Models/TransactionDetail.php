<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'cantidad',
        'total'
    ];

    public function transaccion()
    {
        return $this->belongsTo(Transaction::class, 'transaccion_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'producto_id');
    }
}
