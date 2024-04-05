<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            $table->string('ruc')->unique();
            $table->string('nombre')->unique();
            $table->string('direccion');
            $table->string('telefono_uno')->nullable();
            $table->string('telefono_dos')->nullable();
            $table->string('email')->unique();
            $table->string('razon_social')->nullable();
            $table->string('imagen')->nullable();
            $table->date('fecha_inicio_negocios')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
