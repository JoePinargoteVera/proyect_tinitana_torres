<?php

namespace App\Http\Controllers;

use App\Mail\sendPassword;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function RegistroUsuarios(Request $request)
    {

        try {
            $request->validate([
                'name' => 'required|string|max:50',
                'nombres' => 'required|string|max:255',
                'apellidos' => 'required|string|max:255',
                'cedula' => 'required|string|unique:clients,cedula|min:10|max:10',
                'email' => 'required|email|unique:users,email|max:255',
                // 'password' => 'required|stri}ng|min:8|max:20',
                'rol' => 'required|string|max:255',
                'telefono' => 'required|string|max:20',
                'direccion' => 'required|string|max:255',
                // 'imagen' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
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

            $password = Str::random(10);

            $user = new User();
            $user->name = $request->name;
            $user->nombres = $request->nombres;
            $user->apellidos = $request->apellidos;
            $user->cedula = $request->cedula;
            $user->email = $request->email;
            $user->password = hash::make($password);
            $user->rol = $request->rol;
            $user->telefono = $request->telefono;
            $user->direccion = $request->direccion;
            $user->imagen = $request->imagen;
            $user->save();
            // event(new Registered($user));
            // $token = JWTAuth::fromUser($user);


            DB::commit();
            Mail::to($user->email)->send(new sendPassword($password));
            return response()->json([
                'user' => $user,
                'message' => 'usuario registrado con exito',
                'status' => Response::HTTP_CREATED
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'no se ha podido guardar la imagen',
                'error' => 'Error creating user: ' . $e->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function ObtenerUsuarios()
    {

        try {
            $usuarios = User::all();
            if ($usuarios->isEmpty()) {

                return response()->json([
                    'message' => 'no existe ningun usuario registrado',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            return response()->json([
                'data' => $usuarios,
                'message' => 'lista de usuarios obtenida con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la lista de los usuarios, intentelo de nuevo mas tarde',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function ObtenerUsuario(Request $request)
    {
        try {
            $usuario = User::where('id', $request->id)->first();
            if (!$usuario) {

                return response()->json([
                    'message' => 'no existe ningun usuario que coincida con el id',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'user' => $usuario,
                'message' => 'usuario obtenido con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la informacion del usuario, intentelo nuevamente en unos minutos',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function BuscarUsuarios(Request $request)
    {

        $filtro = $request->filtro;

        try {

            $usuarios = User::where(function ($query) use ($filtro) {
                $query->whereRaw("id REGEXP ?", ["$filtro"])
                    ->orWhereRaw("name REGEXP ?", ["$filtro"])
                    ->orWhereRaw("rol REGEXP ?", ["$filtro"])
                    ->orWhereRaw("email REGEXP ?", ["$filtro"]);
            })->get();


            if ($usuarios->isEmpty()) {
                return response()->json([
                    'message' => 'no se encontraron resultados',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'data' => $usuarios,
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

    public function ActualizarUsuario(Request $request)
    {
        try {

            $request->validate([

                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email|max:255',
                'telefono' => 'sometimes|string|max:20',
                'direccion' => 'sometimes|string|max:255',
                // 'imagen' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
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

            $usuario = User::find($request->id)->first();
            if (!$usuario) {
                return response()->json([
                    'message' => 'usuario no encontrado',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            $usuario->fill($request->all())->save();

            DB::commit();
            return response()->json([
                'user' => $usuario,
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
    public function EliminarUsuario(Request $request)
    {

        DB::beginTransaction();
        try {
            //code...
            $user = User::findOrFail($request->id);

            if (!$user) {
                # code...
                return response()->json([
                    'message' => 'no se encontro el usuario',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            $user->estado = false; // Cambiar estado a false en lugar de eliminar
            $user->save();

            DB::commit();
            return response()->json([
                'message' => 'usuario eliminado con exito',
                'status' => Response::HTTP_OK
            ]);
        } catch (\Throwable $th) {
            Db::rollBack();
            return response()->json([
                'message' => 'no se pudo eliminar al usuario, por favor intentelo mas tarde',
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }
}
