<?php

namespace App\Http\Controllers;

use App\Mail\Bill as MailBill;
use App\Models\Bill;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Mail;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class FacturaController extends Controller
{
    public function GenerarFactura(Request $request)
    {

        try {
            $fechaHora = now('America/Guayaquil');
            $fecha_formateada = Carbon::createFromFormat('Y-m-d H:i:s', $fechaHora);
            $fechaVencimiento = $fechaHora->addMonths(3);

            $factura = new Bill();
            $factura->numero = $this->generarNumeroFactura();
            $factura->fecha_emision = $fecha_formateada->toDateString();
            $factura->subtotal = $this->calcularSubTotal($request->transaccion_id);
            $factura->estado = $request->estado;
            $factura->iva = $request->iva;
            $factura->total = $this->calcularTotal($factura->subtotal, $factura->iva);
            $factura->user_id = $request->user_id;
            $factura->transaccion_id = $request->transaccion_id;
            $factura->vencimiento = $fechaVencimiento->toDateString();
            $factura->save();

            return response()->json([
                'factura' => $factura,
                'message' => 'factura creada con exito',
                'status' => Response::HTTP_CREATED
            ]);
        } catch (\Throwable $th) {
            return response()->json([

                'message' => 'no se pudo crear la factura, intentelo nuevamente en unos minutos',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_CREATED
            ]);
        }
    }

    private function generarNumeroFactura()
    {

        $ruc = '001';
        $numeroFacturero = '004';
        $ultimaFactura = Bill::orderBy('id', 'desc')->first();

        // dd($ultimaFactura);

        // Generar un nuevo número de factura único
        if ($ultimaFactura) {

            $numeroFactura = $ultimaFactura->numero;

            // Obtener los últimos 9 dígitos después del último guion
            $posicionUltimoGuion = strrpos($numeroFactura, '-');
            $ultimoNumero = substr($numeroFactura, $posicionUltimoGuion + 1);

            // Incrementar el último número en uno
            $nuevoNumero = intval($ultimoNumero) + 1;
            $numeroFormateado = str_pad($nuevoNumero, 9, '0', STR_PAD_LEFT);
            // dd($ultimoNumero);
            $numeroFactura = $ruc . '-' . $numeroFacturero . '-' . $numeroFormateado;
        } else {
            // Si no hay facturas en la base de datos, comenzar desde 1
            $nuevoNumero = 1;
            // Formatear el nuevo número de factura con un sufijo y longitud fija
            $numeroFormateado = str_pad($nuevoNumero, 9, '0', STR_PAD_LEFT); // Ajustar la longitud según sea necesario
            $numeroFactura = $ruc . '-' . $numeroFacturero . '-' . $numeroFormateado;
        }




        return $numeroFactura;
    }

    private function calcularTotal($sub_total, $iva)
    {

        $total = ($sub_total + $iva);

        return $total;
    }

    private function calcularSubTotal($transaccion_id)
    {
        // Calcular el total de la transacción sumando los precios de los productos
        $detalles = TransactionDetail::where('transaccion_id', $transaccion_id)->get();
        $total = 0;
        foreach ($detalles as $detalle) {
            $total += $detalle->total;
        }
        return $total;
    }

    public function ObtenerFacturas(Request $request)
    {
        try {

            $facturas = Bill::with([
                'transaccion' => function ($query) {
                    $query->select('id', 'cliente_id', 'fecha', 'hora', 'observacion');
                },
                'transaccion.transactionDetail' => function ($query) {
                    $query->select('id', 'transaccion_id', 'producto_id', 'cantidad', 'total');
                },
                'transaccion.transactionDetail.product' => function ($query) {
                    $query->select('id', 'nombre', 'pvp', 'codigo_barras');
                },
                'user' => function ($query) {
                    $query->select('id', 'name', 'email');
                },
                'transaccion.client' => function ($query) {
                    $query->select('id', 'nombres', 'cedula');
                }
            ])->get();

            if ($facturas->isEmpty()) {
                return response()->json([
                    'message' => 'no se han guardado facturas',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'data' => $facturas,
                'message' => 'lista de facturas obtenida con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la lista de facturas',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function ObtenerFactura(Request $request)
    {
        try {
            $factura = Bill::with([
                'transactions.transaction_details.products',
                'users', 'transactions.clients'
            ])->findOrFail($request->factura_id);

            if (!$factura) {

                return response()->json([
                    'message' => 'no se ha encontrado la factura solicitada',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'factura' => $factura,
                'message' => 'la factura ha sido obtenida con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'ha ocurrido un eeror inesperado, intente mas tarde',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function BuscarFacturas(Request $request)
    {

        try {
            $request->validate([
                'id' => 'required|numeric', // Filtro de búsqueda
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'los datos enviados no cumplen con las especificaciones',
                'error' => $e->errors(),
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY
            ]);
        }

        try {

            $id = $request->id;

            // Realizar la consulta de las facturas que coincidan con el filtro
            // $productos = Product::where(function ($query) use ($filtro, $proveedores, $categorias, $filtroCosto) 

            $datosFactura = Bill::with([
                'transaccion' => function ($query) {
                    $query->select('id', 'cliente_id', 'fecha', 'hora', 'observacion');
                },
                'transaccion.transactionDetail' => function ($query) {
                    $query->select('id', 'transaccion_id', 'producto_id', 'cantidad', 'total');
                },
                'transaccion.transactionDetail.product' => function ($query) {
                    $query->select('id', 'nombre', 'pvp', 'codigo_barras');
                },
                'user' => function ($query) {
                    $query->select('id', 'name', 'email');
                },
                'transaccion.client' => function ($query) {
                    $query->select('*');
                }
            ])->where('id', $id)
                ->first();

            if (!$datosFactura) {
                return response()->json([
                    'message' => 'no se han encontrado coincidencias',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            $view = view('factura');
            $view->with('datosFactura', $datosFactura);
            $contenidoHTML = $view->render();

            $opciones = new Options();
            $opciones->set('isHtml5ParserEnabled', true);
            $opciones->set('isRemoteEnabled', true);

            $dompdf = new Dompdf($opciones);

            $dompdf->loadHtml($contenidoHTML);

            // Renderizar el PDF
            $dompdf->render();

            // Obtener el contenido del PDF como una cadena
            $contenidoPDF = $dompdf->output();
            // dd($datosFactura->transaccion->client->email);

            if ($datosFactura->transaccion->client) {
                $email = $datosFactura->transaccion->client->email;
            } else {
                return response()->json([
                    'messaje' => 'no se ha podido obtener el email del cliente',
                    'status' => Response::HTTP_BAD_REQUEST
                ]);
            }

            Mail::to($email)
                ->send(new MailBill($contenidoPDF, $datosFactura));

            // Guardar el PDF en el servidor (opcional)
            $pdfPath = storage_path('app/public/facturas/factura.pdf');
            file_put_contents($pdfPath, $contenidoPDF);

            // return view('factura')->with('datosFactura',$datosFactura);

            return response()->json([
                'data' => $datosFactura,
                'message' => 'facturas encontrados con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo realizar la busqueda, intentelo mas tarde',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function EliminarFactura(Request $request)
    {

        try {
            DB::beginTransaction();
            $factura = Bill::find($request->factura_id);

            // Verificar si la factura existe
            if (!$factura) {
                return response()->json([
                    'message' => 'La factura no existe',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            // Eliminar la factura
            $factura->estado = false; // Cambiar estado a false en lugar de eliminar
            $factura->save();

            DB::commit();
            return response()->json([
                'message' => 'La factura ha sido eliminada correctamente',
                'status' => Response::HTTP_OK
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'ocurrio un inconveniente al eliminar la factura, intentelo mas tarde',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    function enviarFactura(Request $request)
    {

        try {
            $request->validate([
                'id' => 'required|numeric', // Filtro de búsqueda
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'los datos enviados no cumplen con las especificaciones',
                'error' => $e->errors(),
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY
            ]);
        }

        try {

            $id = $request->id;
            $pdfFile = $request->file('pdfFile');

            $datosFactura = Bill::with([
                'transaccion' => function ($query) {
                    $query->select('id', 'cliente_id', 'fecha', 'hora', 'observacion');
                },
                'transaccion.transactionDetail' => function ($query) {
                    $query->select('id', 'transaccion_id', 'producto_id', 'cantidad', 'total');
                },
                'transaccion.transactionDetail.product' => function ($query) {
                    $query->select('id', 'nombre', 'pvp', 'codigo_barras');
                },
                'user' => function ($query) {
                    $query->select('id', 'name', 'email');
                },
                'transaccion.client' => function ($query) {
                    $query->select('*');
                }
            ])->where('id', $id)
                ->first();

            if (!$datosFactura) {
                return response()->json([
                    'message' => 'no se han encontrado coincidencias',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }


            // $opciones = new Options();
            // $opciones->set('isPhpEnabled', true);
            // $opciones->set('isHtml5ParserEnabled', true);
            // $opciones->set('isRemoteEnabled', true);

            // $dompdf = new Dompdf($opciones);

            // $view = view('factura');
            // $view->with('datosFactura', $datosFactura);
            // $contenidoHTML = $view->render();

            // $dompdf->loadHtml($contenidoHTML);

            // // Renderizar el PDF
            // $dompdf->render();

            // // Obtener el contenido del PDF como una cadena
            // $contenidoPDF = $dompdf->output();

            if ($datosFactura->transaccion->client) {
                $email = $datosFactura->transaccion->client->email;
            } else {
                return response()->json([
                    'messaje' => 'no se ha podido obtener el email del cliente',
                    'status' => Response::HTTP_BAD_REQUEST
                ]);
            }
            $cliente = $datosFactura->transaccion->client;
            Mail::raw('Adjunto encontrarás el PDF', function ($message) use ($pdfFile, $cliente) {
                $message->to($cliente->email)
                        ->subject('PDF para ' . $cliente->nombres)
                        ->attach($pdfFile->getRealPath(), [
                            'as' => $pdfFile->getClientOriginalName(),
                            'mime' => $pdfFile->getClientMimeType(),
                        ]);
            });

            // Mail::to($email)
            //     ->send(new MailBill($contenidoPDF, $datosFactura));

            // Guardar el PDF en el servidor (opcional)
            // $pdfPath = storage_path('app/public/facturas/factura.pdf');
            // file_put_contents($pdfPath, $contenidoPDF);

            // return view('factura')->with('datosFactura',$datosFactura);

            return response()->json([
                'message' => 'factura enviada con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo enviar la factura, intentelo mas tarde',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }
}
