<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    public function transactionDetail()
    {
        return $this->hasMany(TransactionDetail::class, 'transaccion_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'cliente_id');
    }
}
