<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ClienteController extends Controller
{
    public function RegistroClientes(Request $request)
    {

        try {
            $request->validate([
                'nombres' => 'required|string|max:100',
                'cedula' => 'required|string|unique:clients,cedula|min:10|max:10',
                'email' => 'required|email|unique:clients,email|max:100',
                'apellidos' => 'required|string|max:100',
                'nacionalidad' => 'sometimes|nullable|string|max:100',
                'telefono_uno' => 'sometimes|nullable|string|max:10',
                'telefono_dos' => 'sometimes|nullable|string|max:10',
                'direccion' => 'sometimes|nullable|string|max:255',
                'fecha_nacimiento'=>'sometimes|nullable|date',
                'genero' => 'sometimes|nullable|string|max:100',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'los datos enviados no cumplen con las especificaciones',
                'validationError' => $e->errors(),
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY
            ]);
        }

        
        $clienteBuscar = Client::where('cedula', $request->cedula)->first();

        if ($clienteBuscar) {
            # code...
        }

        DB::beginTransaction();
        try {
            $cliente = new Client();
            $cliente->cedula = $request->cedula;
            $cliente->nombres = $request->nombres;
            $cliente->apellidos = $request->apellidos;
            $cliente->direccion = $request->direccion;
            $cliente->telefono_uno = $request->telefono_uno;
            $cliente->telefono_dos = $request->telefono_dos;
            $cliente->email = $request->email;
            $cliente->nacionalidad = $request->nacionalidad;
            $cliente->fecha_nacimiento = $request->fecha_nacimiento;
            $cliente->genero = $request->genero;
            $cliente->save();

            DB::commit();
            return response()->json([
                'cliente' => $cliente,
                'message' => 'cliente registrado con exito',
                'status' => Response::HTTP_CREATED
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'no se pudo registrar al cliente',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function ObtenerClientes()
    {

        try {
            $cliente = Client::all();
            if (!$cliente) {

                return response()->json([
                    'message' => 'no existe ningun cliente registrado',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            return response()->json([
                'data' => $cliente,
                'message' => 'lista de clientes obtenida con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la lista de los clientes, intentelo de nuevo mas tarde',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function ObtenerCliente(Request $request)
    {
        try {
            $cliente = Client::where('id', $request->id)->first();
            if (!$cliente) {

                return response()->json([
                    'message' => 'no existe ningun cliente que coincida con el id',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'cliente' => $cliente,
                'message' => 'cliente obtenido con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la informacion del cliente, intentelo nuevamente en unos minutos',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function BuscarClientes(Request $request)
    {

        $filtro = $request->filtro;

        try {
            $clientes = Client::where(function ($query) use ($filtro) {
                $query->whereRaw("id REGEXP ?", ["$filtro"])
                      ->orWhereRaw("cedula REGEXP ?", ["$filtro"])
                      ->orWhereRaw("nombres REGEXP ?", ["$filtro"])
                      ->orWhereRaw("email REGEXP ?", ["$filtro"])
                      ->orWhereRaw("apellidos REGEXP ?", ["$filtro"]);
            })->get();

            if ($clientes->isEmpty()) {
                return response()->json([
                    'message' => 'no se encontraron resultados',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'data' => $clientes,
                'message' => 'clientes encontrados con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo realizar la busqueda, intente mas tarde',
                'error' => $th->getMessage()
            ]);
        }
    }

    public function ActualizarCliente(Request $request)
    {
        try {

            $cliente = Client::where('id',$request->id)->first();
            
            $request->validate([
                'nombres' => 'sometimes|string|max:100',
                'email' => [
                    'sometimes',
                    'email',
                    Rule::unique('clients', 'email')->ignore($cliente->id),
                    'max:100',
                ],
                'apellidos' => 'sometimes|string|max:100',
                'nacionalidad' => 'sometimes|string|max:100',
                'telefono_uno' => 'sometimes|string|max:20',
                'telefono_dos' => 'sometimes|string|max:20|nullable',
                'direccion' => 'sometimes|string|max:255',
                'genero' => 'sometimes|string|max:100',
                'fecha_nacimiento'=>'sometimes|nullable|date'
            ]);

        } catch (ValidationException $e) {

            return response()->json([
                'message' => 'no se pueden procesar los datos enviados',
                'validationError' => $e->errors(),
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY
            ]);
        }

        DB::beginTransaction();
        try {

            
            if (!$cliente) {
                return response()->json([
                    'message' => 'cliente no encontrado',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            // dd($request->all());
            $cliente->fill($request->all())->save();

            DB::commit();
            return response()->json([
                'cliente' => $cliente,
                'message' => 'datos actualizados con exito',
                'status' => Response::HTTP_OK
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message'=>'ha ocurrido un error inesperado al actualizar los datos, intentelo mas tarde',
                'error'=>$th->getMessage(),
                'status'=>Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }
    public function EliminarCliente(Request $request)
    {
        DB::beginTransaction();
        try {
            //code...
            $client = Client::findOrFail($request->id);

            if (!$client) {
                # code...
                return response()->json([
                    'message' => 'no se encontro al cliente',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            $client->estado = false; // Cambiar estado a false en lugar de eliminar
            $client->save();

            DB::commit();
            return response()->json([
                'message' => 'cliente eliminado con exito',
                'status' => Response::HTTP_OK
            ]);
        } catch (\Throwable $th) {
            Db::rollBack();
            return response()->json([
                'message' => 'no se pudo eliminar al cliente, por favor intentelo mas tarde',
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }
}
