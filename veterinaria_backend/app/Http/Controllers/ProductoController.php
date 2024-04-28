<?php

namespace App\Http\Controllers;

use App\Models\ProductCategorie;
use App\Models\Product;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductoController extends Controller
{
    public function RegistroProductos(Request $request)
    {

        try {
            $request->validate([
                'nombre' => 'required|string|max:100',
                'pvp' => 'required|numeric|max:100',
                'descripcion' => 'sometimes|nullable|string|max:300',
                'costo' => 'required|numeric|min:0.01',
                'stock' => 'required|integer|min:1|max:2000',
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
            $producto = new Product();
            $producto->nombre = $request->nombre;
            $producto->pvp = $request->pvp;
            $producto->descripcion = $request->descripcion;
            $producto->costo = $request->costo;
            $producto->stock = $request->stock;
            $producto->imagen = $request->imagen;
            $producto->categoria_id = $request->categoria_id;
            $producto->proveedor_id = $request->proveedor_id;

            $producto->save();

            DB::commit();
            return response()->json([
                'producto' => $producto,
                'message' => 'producto registrado con exito',
                'status' => Response::HTTP_CREATED
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'no se pudo registrar el producto',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function ObtenerProductos()
    {

        try {
            $producto = Product::with('proveedor', 'categoria')->where('estado', true)->get();
            if ($producto->isEmpty()) {

                return response()->json([
                    'message' => 'no existe ningun producto registrado',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            return response()->json([
                'data' => $producto,
                'message' => 'lista de productos obtenida con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la lista de los productos, intentelo de nuevo mas tarde',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function ObtenerProducto(Request $request)
    {
        try {
            $producto = Product::where(['id', $request->id, 'estado', true])->first();
            if (!$producto) {

                return response()->json([
                    'message' => 'no existe ningun producto que coincida con el id',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'producto' => $producto,
                'message' => 'producto obtenido con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la informacion del producto, intentelo nuevamente en unos minutos',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function BuscarProductos(Request $request)
    {

        $filtro = $request->filtro;
        $filtroCosto = $request->filtro_costo;

        try {


            $proveedores = Provider::where('nombre', 'like', '%' . $filtro . '%')->pluck('id');
            $categorias = ProductCategorie::where('nombre', 'like', '%' . $filtro . '%')->pluck('id');

            $productos = Product::where(function ($query) use ($filtro, $proveedores, $categorias, $filtroCosto) {
                $query->whereRaw("id REGEXP ?", ["$filtro"])
                    ->orWhereRaw("nombre REGEXP ?", ["$filtro"]);

                if (!$proveedores->isEmpty()) {
                    $query->orWhereIn('proveedor_id', $proveedores);
                }

                if (!$categorias->isEmpty()) {
                    $query->orWhereIn('categoria_id', $categorias);
                }

                if ($filtroCosto) {
                    if (strpos($filtroCosto, 'menor:') === 0) {
                        $valor = str_replace('menor:', '', $filtroCosto);
                        $query->where('costo', '<', $valor);
                    } elseif (strpos($filtroCosto, 'mayor:') === 0) {
                        $valor = str_replace('mayor:', '', $filtroCosto);
                        $query->where('costo', '>', $valor);
                    } elseif (strpos($filtroCosto, 'entre:') === 0) {
                        $valores = explode(',', str_replace('entre:', '', $filtroCosto));
                        $query->whereBetween('costo', [$valores[0], $valores[1]]);
                    }
                }
            })->with('proveedor', 'categoria')->where('estado', true)->get();


            if ($productos->isEmpty()) {
                return response()->json([
                    'message' => 'no se encontraron resultados',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'data' => $productos,
                'message' => 'productos encontrados con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo realizar la busqueda, intente mas tarde',
                'error' => $th->getMessage()
            ]);
        }
    }

    public function ActualizarProducto(Request $request)
    {
        try {

            $request->validate([
                'nombre' => 'sometimes|string|max:100',
                'pvp' => 'sometimes|numeric|max:100',
                'descripcion' => 'sometimes|string|max:300',
                'costo' => 'sometimes|numeric|min:0.01',
                'stock' => 'sometimes|integer|min:1|max:2000',
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

            $producto = Product::find($request->id)->first();
            if (!$producto) {
                return response()->json([
                    'message' => 'producto no encontrado',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            $producto->fill($request->all())->save();

            DB::commit();
            return response()->json([
                'producto' => $producto,
                'message' => 'datos actualizados con exito',
                'status' => Response::HTTP_OK
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'ha ocurrido un error inesperado al actualizar los datos, intentelo mas tarde',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }
    public function EliminarProducto(Request $request)
    {
        DB::beginTransaction();
        try {
            //code...
            $product = Product::findOrFail($request->id);

            if (!$product) {
                return response()->json([
                    'message' => 'no se encontro el producto',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            $product->estado = false; // Cambiar estado a false en lugar de eliminar
            $product->save();

            DB::commit();
            return response()->json([
                'message' => 'producto eliminado con exito',
                'status' => Response::HTTP_OK
            ]);
        } catch (\Throwable $th) {
            Db::rollBack();
            return response()->json([
                'message' => 'no se pudo eliminar al producto, por favor intentelo mas tarde',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }
}
