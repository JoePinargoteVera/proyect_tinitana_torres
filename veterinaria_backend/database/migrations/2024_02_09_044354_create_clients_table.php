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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('cedula')->unique();
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('direccion')->nullable();
            $table->string('telefono_uno')->nullable();
            $table->string('telefono_dos')->nullable();
            $table->string('email')->unique();
            $table->string('nacionalidad')->nullable();
            $table->boolean('estado')->default(true);
            $table->date('fecha_nacimiento')->nullable();
            $table->string('genero')->nullable();
            $table->string('imagen')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
