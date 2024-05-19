<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
    public function ListarNotificaciones(Request $request)
    {
        try {
            $notifications = Notification::orderBy('created_at', 'desc')->get();

            if ($notifications->isEmpty()) {
                return response()->json([
                    'message' => 'no hay notificaciones por el momento',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }
            return response()->json([
                'data' => $notifications,
                'message' => 'notificaciones obtenidas con exito',
                'status' => Response::HTTP_CREATED
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage(),
                'message' => 'no se pudieron obtener las notificaciones',
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }

    public function ListarNoLeidas(Request $request)
    {
        try {
            $notifications = Notification::where('read_at', null) // Filtrar notificaciones no leídas
                ->orderBy('created_at', 'desc')
                ->get();

            if ($notifications->isEmpty()) {
                return response()->json([
                    'data'=>$notifications,
                    'message' => 'No hay notificaciones no leídas por el momento',
                    'status' => Response::HTTP_NOT_FOUND
                ]);
            }

            return response()->json([
                'data' => $notifications,
                'message' => 'Notificaciones no leídas obtenidas con éxito',
                'status' => Response::HTTP_OK
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage(),
                'message' => 'No se pudieron obtener las notificaciones no leídas',
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR
            ]);
        }
    }


    public function markAsRead(Request $request)
    {

        $fechaHora = now('America/Guayaquil');
        $fecha_formateada = Carbon::createFromFormat('Y-m-d H:i:s', $fechaHora);

        $notification = Notification::find($request->id);
        $notification->read_at = $fecha_formateada;
        $notification->save();

        return response()->json(['message' => 'Notificación marcada como leída']);
    }
}
