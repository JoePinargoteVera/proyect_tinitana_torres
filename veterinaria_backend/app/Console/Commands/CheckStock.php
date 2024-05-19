<?php

namespace App\Console\Commands;

use App\Models\Notification;
use App\Models\Product;
use Illuminate\Console\Command;

class CheckStock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:stock';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verificar stock bajo y generar notificaciones';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $threshold = 40; // Umbral de stock bajo
        $products = Product::all();

        foreach ($products as $product) {
            if ($product->stock < $threshold) {
                $notification = new Notification([
                    'mensaje' => 'El producto "' . $product->nombre . '" tiene un stock bajo.',
                ]);
                $notification->save();
            }
        }

        $this->info('Verificación de stock bajo completada.');
    
    }
}
