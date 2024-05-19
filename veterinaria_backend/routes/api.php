<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ConfiguracionController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\TransaccionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(AuthController::class)->prefix('auth')->group(function(){
    Route::post('singup','registro');
    Route::post('login','login');
    Route::post('logout','logout')->middleware('jwt.verified');
});

Route::controller(ClienteController::class)->middleware('jwt.verified')->prefix('cliente')->group(function(){//->middleware('jwt.verified') 
    
    Route::post('crear','RegistroClientes');
    Route::delete('eliminar','EliminarCliente');
    Route::put('actualizar','ActualizarCliente');
    Route::get('ver','ObtenerCliente');
    Route::get('listar','ObtenerClientes');
    Route::get('buscar','BuscarClientes');

});

Route::controller(ProductoController::class)->middleware('jwt.verified')->prefix('producto')->middleware('jwt.verified')->group(function(){// 
    
    Route::post('crear','RegistroProductos');
    Route::put('eliminar','EliminarProducto');
    Route::put('incrementar','añadirStock');
    Route::put('decrementar','quitarStock');
    Route::patch('actualizar','ActualizarProducto');
    Route::get('ver','ObtenerProducto');
    Route::get('listar','ObtenerProductos');
    Route::get('buscar','BuscarProductos');

});

Route::controller(ProveedorController::class)->middleware('jwt.verified')->prefix('proveedor')->group(function(){//->middleware('jwt.verified') 
    
    Route::post('crear','RegistroProveedores');
    Route::delete('eliminar','EliminarProveedor');
    Route::put('actualizar','ActualizarProveedor');
    Route::get('ver','ObtenerProveedor');
    Route::get('listar','ObtenerProveedores');
    Route::get('buscar','BuscarProveedores');
    Route::get('listar_productos','obtenerProductos');

});

Route::controller(CategoriaController::class)->middleware('jwt.verified')->prefix('categoria')->group(function(){//->middleware('jwt.verified') 
    
    Route::post('crear','RegistroCategorias');
    Route::delete('eliminar','EliminarCategoria');
    Route::put('actualizar','ActualizarCategoria');
    Route::get('ver','ObtenerCategoria');
    Route::get('listar','ObtenerCategorias');
    Route::get('buscar','BuscarCategorias');

});

Route::controller(TransaccionController::class)->middleware('jwt.verified')->prefix('transaccion')->group(function(){//->middleware('jwt.verified') 
    
    Route::post('crear','CrearTransaccion');
    // Route::delete('eliminar','EliminarCategoria');
    // Route::put('actualizar','ActualizarCategoria');
    // Route::get('ver','ObtenerCategoria');
    Route::get('lista_clientes','verTransaccionPorCliente');
    // Route::get('buscar','BuscarCategorias');

});

Route::controller(NotificationController::class)->middleware('jwt.verified')->prefix('notificacion')->group(function(){//->middleware('jwt.verified') ventasTotales
    
    Route::get('listar_no_leidas','ListarNoLeidas');
    Route::get('listar','ListarNotificaciones');
    Route::post('read_at','markAsRead');
});

Route::controller(HomeController::class)->middleware('jwt.verified')->prefix('home')->group(function(){//->middleware('jwt.verified') ventasTotales
    
    Route::get('ventas','ventasTotales');
    Route::get('venta_productos','totalPorProducto');
    // Route::post('read_at','markAsRead');


});

Route::controller(UserController::class)->middleware('jwt.verified')->prefix('usuario')->group(function(){//->middleware('jwt.verified') 
    
    Route::post('crear','RegistroUsuarios');
    Route::delete('eliminar','EliminarUsuario');
    Route::put('actualizar','ActualizarUsuario');
    Route::get('ver','ObtenerUsuario');
    Route::get('listar','ObtenerUsuarios');
    Route::get('buscar','BuscarUsuarios');

});

Route::controller(FacturaController::class)->prefix('factura')->group(function(){//->middleware('jwt.verified') ObtenerConfiguracion
    
    Route::post('crear','GenerarFactura');
    Route::delete('eliminar','EliminarCategoria');
    // Route::put('actualizar','ActualizarCategoria');
    Route::get('ver','ObtenerFactura');
    Route::get('listar','ObtenerFacturas');
    Route::get('buscar','BuscarFacturas');
    Route::post('enviar','enviarFactura');

});

Route::controller(ConfiguracionController::class)->prefix('configuracion')->group(function(){//->middleware('jwt.verified') ObtenerConfiguracion
    
    // Route::post('crear','GenerarFactura');
    // Route::delete('eliminar','EliminarCategoria');
    // Route::put('actualizar','ActualizarCategoria');
    Route::get('ver','ObtenerConfiguracion');
    // Route::get('listar','ObtenerFacturas');
    // Route::get('buscar','BuscarFacturas');
    // Route::post('enviar','enviarFactura');

});
