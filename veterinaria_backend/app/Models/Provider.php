<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'nombre',
        'direccion',
        'telefono_uno',
        'telefono_dos',
        'email',
        'razon_social',
        'fecha_inicio_negocios',
        'ruc'
    ];

    public function productos()
{
    return $this->hasMany(Product::class, 'proveedor_id');
}
}
