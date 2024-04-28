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
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->date('fecha_emision')->default(now());
            $table->decimal('subtotal',10,2);
            $table->decimal('descuento',10,2)->nullable();
            $table->decimal('iva',10,2)->nullable();
            $table->decimal('total',10,2);
            $table->boolean('estado')->default(true);
            $table->date('vencimiento');
            $table->unsignedBigInteger('transaccion_id');
            $table->foreign('transaccion_id')->references('id')->on('transactions');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
