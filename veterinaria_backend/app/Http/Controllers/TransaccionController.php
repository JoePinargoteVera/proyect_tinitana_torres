<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use Illuminate\Http\Request;
use App\Models\Factura;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class TransaccionController extends Controller
{
    public function CrearTransaccion(Request $request)
    {
        $fechaHora = now();
        $fecha_formateada = Carbon::createFromFormat('Y-m-d H:i:s', $fechaHora);

        try {
            if ($request->productos == null) {
                return response()->json([
                    'message' => 'no se puede realizar la transaccion sin productos asociados',
                    'status' => Response::HTTP_FORBIDDEN
                ]);
            }
            DB::beginTransaction();
            $transaccion = new Transaction();
            $transaccion->observacion = $request->observacion;
            $transaccion->fecha = $fecha_formateada->toDateString();
            $transaccion->hora = $fecha_formateada->toTimeString();
            $transaccion->cliente_id = $request->cliente_id;
            $transaccion->save();
            $transaccion_id = $transaccion->id;

            // Guardar los detalles de la transacción
            foreach ($request->productos as $producto) {
                $producto_id = $producto['id'];
                $cantidad = $producto['cantidad'];
                
                $detalle = new TransactionDetail();
                $detalle->transaccion_id = $transaccion_id;
                $detalle->producto_id = $producto_id;
                $detalle->cantidad = $cantidad;
                $detalle->total = $producto['total']; // Se asume que se recibe el precio desde el frontend
                $detalle->save();

                Product::where('id', $producto_id)->decrement('stock', $cantidad);
            }

            
            
            DB::commit();
            return response()->json([
                'data' => $transaccion,
                'message' => 'Transacción realizada con éxito',
                'status' => Response::HTTP_CREATED
            ]);
        } catch (\Throwable $th) {

            DB::rollBack();
            return response()->json([
                'error' => $th->getMessage(),
                'message' => 'no se pudo realizar la transaccion',
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }
}
