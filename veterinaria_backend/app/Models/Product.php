<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'nombre',
        'pvp',
        'costo',
        'stock',
        'descripcion'
    ];

    public function transactionDetail()
    {
        return $this->hasMany(TransactionDetail::class, 'producto_id');
    }

    public function proveedor()
    {
        return $this->belongsTo(Provider::class);
    }

    public function categoria()
    {
        return $this->belongsTo(ProductCategorie::class);
    }
}
