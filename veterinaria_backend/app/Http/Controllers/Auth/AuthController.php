<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function registro(Request $request)
    {

        // $request->validate([
        //     'name' => 'required|string|max:255',
        //     'email' => 'required|email|unique:users,email|max:255',
        //     'password' => 'required|string|min:8|confirmed|max:20',
        //     'rol' => 'required|string|max:255',
        //     'telefono_uno' => 'required|string|max:20',
        //     'telefono_dos' => 'required|string|max:20',
        //     'direccion' => 'required|string|max:255',
        //     'imagen' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048' 
        // ]);

        // $rutaImagen = $request->file('imagen')->store('imagenes_user');

        DB::beginTransaction();
        try {
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = hash::make($request->password);
            $user->rol = $request->rol;
            $user->telefono = $request->telefono;
            $user->direccion = $request->direccion;
            // $user->imagen = $rutaImagen;
            $user->save();
            // event(new Registered($user));
            $token = JWTAuth::fromUser($user);


            DB::commit();
            return response()->json([
                'data' => $user,
                'token' => $token,
                'status' => Response::HTTP_CREATED
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'error' => 'Error creating user: ' . $e->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'message' => 'email o contraseña incorrectos'
                ], 400);
            }

            $user = User::where('email', $request->email)->first();


            if (!$user) {
                return response()->json([
                    'message' => 'no existe el usuario',
                    'status' => Response::HTTP_BAD_REQUEST
                ]);
            }
            return response()->json([
                'token' => $token,
                'message' => 'inicio de sesion existoso',
                'status' => Response::HTTP_OK,
                'user' => $user
            ], 200);
        } catch (JWTException $e) {
            response()->json([
                'message' => 'token no creado'
            ], 500);
        }
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['mensaje' => 'Logout exitoso']);
    }
}
