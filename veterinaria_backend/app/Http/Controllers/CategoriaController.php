<?php

namespace App\Http\Controllers;

use App\Models\ProductCategorie;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CategoriaController extends Controller
{
    public function RegistroCategorias(Request $request)
    {

        try {
            $request->validate([
                'nombre' => 'required|string|max:100',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'los datos enviados no cumplen con las especificaciones',
                'error' => $e->errors(),
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY
            ]);
        }

        try {
            DB::beginTransaction();

            $categoria = new ProductCategorie();
            $categoria->nombre = $request->nombre;
            $categoria->save();

            DB::commit();
            return response()->json([
                'data' => $categoria,
                'message' => 'categoria registrada con exito',
                'status' => Response::HTTP_CREATED
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'no se pudo registrar la categoria, intentelo mas tarde',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_CREATED
            ]);
        }
    }

    public function ObtenerCategorias(Request $request)
    {
        try {
            $categoria = ProductCategorie::all();

            if ($categoria == null) {
                return response()->json([
                    'message' => 'no existen categorias registradas',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'data' => $categoria,
                'message' => 'lista de categorias obtenida con exito',
                'status' => Response::HTTP_NOT_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la lista de categorias',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_NOT_FOUND
            ]);
        }
    }

    public function ObtenerCategoria(Request $request) {
        try {
            $categoria = ProductCategorie::where('id', $request->id)->first();
            if (!$categoria) {

                return response()->json([
                    'message' => 'no existe ninguna categoria que coincida',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'data' => $categoria,
                'message' => 'categoria obtenido con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la informacion de la categoria, intentelo nuevamente en unos minutos',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function BuscarClientes(Request $request)
    {

        $filtro = $request->filtro;

        try {
            $categorias = ProductCategorie::where(function ($query) use ($filtro) {
                $query->whereRaw("id REGEXP ?", ["$filtro"])
                      ->orWhereRaw("nombre REGEXP ?", ["$filtro"]);
            })->get();

            if ($categorias->isEmpty()) {
                return response()->json([
                    'message' => 'no se encontraron resultados',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'data' => $categorias,
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

    public function ActualizarCategoria(Request $request){
        try {

            $request->validate([
                'nombre' => 'sometimes|string|max:100',
            ]);

        } catch (ValidationException $e) {

            return response()->json([
                'message' => 'no se pueden procesar los datos enviados',
                'error' => $e->errors(),
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY
            ]);
        }

        DB::beginTransaction();
        try {

            $categoria = ProductCategorie::find($request->id);
            if (!$categoria) {
                return response()->json([
                    'message' => 'categoria no encontrado',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            $categoria->fill($request->all())->save();

            return response()->json([
                'data' => $categoria,
                'message' => 'datos actualizados con exito',
                'status' => Response::HTTP_OK
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message'=>'ha ocurrido un error inesperado al actualar los datos, intentelo mas tarde',
                'error'=>$th->getMessage(),
                'status'=>Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function Eliminarcategoria(Request $request){
        
        DB::beginTransaction();
        try {
            //code...
            $category = ProductCategorie::findOrFail($request->id);

            if (!$category) {
                # code...
                return response()->json([
                    'message' => 'no se encontro la categoria',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            $category->delete();

            DB::commit();
            return response()->json([
                'message' => 'categoria eliminada con exito',
                'status' => Response::HTTP_OK
            ]);
        } catch (\Throwable $th) {
            Db::rollBack();
            return response()->json([
                'message' => 'no se pudo eliminar la categoria, por favor intentelo mas tarde',
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }
}
