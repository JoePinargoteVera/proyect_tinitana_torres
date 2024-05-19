<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ConfiguracionController extends Controller
{
    public function ObtenerConfiguracion(Request $request)
    {
        try {
            $setting = Setting::all()->first();
            if (!$setting) {

                return response()->json([
                    'message' => 'no existe ninguna configuracion guardada',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'setting' => $setting,
                'message' => 'configuracion obtenida con exito',
                'status' => Response::HTTP_FOUND
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'no se pudo obtener la informacion de la configuracion, intentelo nuevamente en unos minutos',
                'error' => $th->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }
}
