<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProveedorController extends Controller
{
    public function RegistroProveedores(Request $request)
    {

        try {
            $request->validate([
                'nombre' => 'required|string|max:100',
                'ruc' => 'required|string',
                'email' => 'required|email|unique:providers,email|max:100',
                'razon_social' => 'sometimes|nullable|string|max:100',
                'fecha_inicio_negocios' => 'sometimes|nullable|date',
                'telefono_uno' => 'required|string|max:20',
                'telefono_dos' => 'sometimes|nullable|string|max:20',
                'direccion' => 'required|string|max:255'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'los datos enviados no cumplen con las especificaciones',
                'validationError' => $e->errors(),
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY
            ]);
        }

        DB::beginTransaction();
        try {
            $proveedor = new Provider();
            $proveedor->ruc = $request->ruc;
            $proveedor->nombre = $request->nombre;
            $proveedor->direccion = $request->direccion;
            $proveedor->telefono_uno = $request->telefono_uno;
            $proveedor->telefono_dos = $request->telefono_dos;
            $proveedor->email = $request->email;
            $proveedor->razon_social = $request->nacionalidad;
            $proveedor->fecha_inicio_negocios = $request->fecha_inicio_negocios;
            $proveedor->save();

            DB::commit();
            return response()->json([
                'proveedor' => $proveedor,
                'message' => 'proveedor registrado con exito',
                'status' => Response::HTTP_CREATED
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'no se pudo registrar al proveedor',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function ObtenerProveedores()
    {

        try {
            $proveedores = Provider::all();
            if ($proveedores->isEmpty()) {

                return response()->json([
                    'message' => 'no existe ningun proveedor registrado',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            return response()->json([
                'data' => $proveedores,
                'message' => 'lista de proveedores obtenida con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la lista de los proveedores, intentelo de nuevo mas tarde',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function ObtenerProveedor(Request $request)
    {
        try {
            $proveedor = Provider::where('id', $request->id)->first();
            if (!$proveedor) {

                return response()->json([
                    'message' => 'no existe ningun proveedor que coincida',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'proveedor' => $proveedor,
                'message' => 'proveedor obtenido con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la informacion del proveedor, intentelo nuevamente en unos minutos',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function BuscarProveedores(Request $request)
    {

        $filtro = $request->filtro;

        try {
            $proveedores = Provider::where(function ($query) use ($filtro) {
                $query->where('id', 'regexp', "/$filtro/i")
                    ->orWhere('ruc', 'regexp', "/$filtro/i")
                    ->orWhere('nombre', 'regexp', "/$filtro/i")
                    ->orWhere('razon_social', 'regexp', "/$filtro/i");
                    
            })->get();


            // $clientes = Cliente::where(function ($query) use ($filtro) {
            //     $query->where('id', 'like', "%$filtro%")
            //           ->orWhere('cedula', 'like', "%$filtro%")
            //           ->orWhere('nombre', 'like', "%$filtro%")
            //           ->orWhere('apellido', 'like', "%$filtro%")
            //           ->orWhere('email', 'like', "%$filtro%");
            // })->get();

            if ($proveedores == null) {
                return response()->json([
                    'message' => 'no se encontraron resultados',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'data' => $proveedores,
                'message' => 'proveedores encontrados con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo realizar la busqueda, intente mas tarde',
                'error' => $th->getMessage()
            ]);
        }
    }

    public function ActualizarProveedor(Request $request)
    {
        try {

            $request->validate([
                'nombre' => 'sometimes|string|max:100',
                'ruc' => 'sometimes|unique:providers,ruc|string',
                'email' => 'sometimes|email|unique:providers,email|max:100',
                'razon_social' => 'sometimes|nullable|string|max:100',
                'fecha_inicio_negocios' => 'sometimes|nullable|date',
                'telefono_uno' => 'sometimes|nullable|string|max:20',
                'telefono_dos' => 'sometimes|nullable|string|max:20',
                'direccion' => 'sometimes|string|max:255'
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

            $proveedor = Provider::find($request->id);
            if (!$proveedor) {
                return response()->json([
                    'message' => 'proveedor no encontrado',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            $proveedor->fill($request->all())->save();

            DB::commit();
            return response()->json([
                'proveedor' => $proveedor,
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
    public function EliminarProveedor(Request $request)
    {
        DB::beginTransaction();
        try {
            //code...
            $provider = Provider::findOrFail($request->id);

            if (!$provider) {
                # code...
                return response()->json([
                    'message' => 'no se encontro el proveedor',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            $provider->estado = false; // Cambiar estado a false en lugar de eliminar
            $provider->save();

            DB::commit();
            return response()->json([
                'message' => 'proveedor eliminado con exito',
                'status' => Response::HTTP_OK
            ]);
        } catch (\Throwable $th) {
            Db::rollBack();
            return response()->json([
                'message' => 'no se pudo eliminar al proveedor, por favor intentelo mas tarde',
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }
}
