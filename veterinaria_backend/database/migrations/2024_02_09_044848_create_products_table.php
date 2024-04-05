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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('codigo_barras')->unique()->nullable();
            $table->string('descripcion',500)->nullable();
            $table->string('fecha_elaboracion')->nullable();
            $table->string('fecha_vencimiento')->nullable();
            $table->string('fecha_adquisicion')->nullable();
            $table->decimal('pvp',10,2);
            $table->decimal('costo',10,2);
            $table->integer('stock')->default(0);
            $table->unsignedBigInteger('categoria_id');
            $table->string('imagen')->nullable();
            $table->foreign('categoria_id')->references('id')->on('product_categories');
            $table->unsignedBigInteger('proveedor_id');
            $table->foreign('proveedor_id')->references('id')->on('providers');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
