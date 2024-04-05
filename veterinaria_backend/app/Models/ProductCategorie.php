<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategorie extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre'
    ];

    public function productos()
{
    return $this->hasMany(Product::class, 'categoria_id');
}
}
