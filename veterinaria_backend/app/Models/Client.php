<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'fecha_nacimiento',
        'nombres',
        'apellido',
        'direccion',
        'telefono_uno',
        'telefono_dos',
        'email',
        'genero',
        'nacioinalidad',
        'cedula',
        'estado'
    ];

    public function transaccion()
    {
        return $this->hasMany(Transaction::class, 'cliente_id');
    }
}
