<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Product;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    // public function ventasTotales()
    // {
    //     // Obtener datos de ventas agrupados por año, mes, semana y día
    //     $ventasPorAnio = Bill::select(
    //         DB::raw('YEAR(fecha_emision) as anio'),
    //         DB::raw('SUM(total) as total')
    //     )->groupBy(DB::raw('YEAR(fecha_emision)'))->get();

    //     $ventasPorMes = Bill::select(
    //         DB::raw('YEAR(fecha_emision) as anio'),
    //         DB::raw('MONTH(fecha_emision) as mes'),
    //         DB::raw('SUM(total) as total')
    //     )->groupBy(DB::raw('YEAR(fecha_emision)'), DB::raw('MONTH(fecha_emision)'))->get();

    //     $ventasPorSemana = Bill::select(
    //         DB::raw('YEAR(fecha_emision) as anio'),
    //         DB::raw('WEEK(fecha_emision) as semana'),
    //         DB::raw('SUM(total) as total')
    //     )->groupBy(DB::raw('YEAR(fecha_emision)'), DB::raw('WEEK(fecha_emision)'))->get();

    //     $ventasPorDia = Bill::select(
    //         DB::raw('YEAR(fecha_emision) as anio'),
    //         DB::raw('MONTH(fecha_emision) as mes'),
    //         DB::raw('DAY(fecha_emision) as dia'),
    //         DB::raw('SUM(total) as total')
    //     )->groupBy(DB::raw('YEAR(fecha_emision)'), DB::raw('MONTH(fecha_emision)'), DB::raw('DAY(fecha_emision)'))->get();

    //     // return view('dashboard', compact('ventasPorAnio', 'ventasPorMes', 'ventasPorSemana', 'ventasPorDia'));

    //     return response()->json([
    //         'anio'=>$ventasPorAnio,
    //         'mes'=>$ventasPorMes,
    //         'semana'=>$ventasPorSemana,
    //         'dia'=>$ventasPorDia,
    //     ]);
    // }

    public function totalPorProducto()
    {
        $totalPorProducto = Product::leftJoin('transaction_details', 'products.id', '=', 'transaction_details.producto_id')
        ->select(
            'products.nombre as nombre_producto',
            DB::raw('COALESCE(SUM(transaction_details.total), 0) as total_generado')
        )
        ->groupBy('products.id', 'products.nombre')
        ->get();

    return response()->json($totalPorProducto);
    }

    public function ventasTotales()
{
    // Obtener datos de ventas agrupados por fecha exacta, por mes, y por día

    //$fechaActual2 = Carbon::now()->format('Y-m-d'); // Obtiene la fecha actual en formato "YYYY-MM-DD"
    $fechaActual = Carbon::now('America/Guayaquil')->format('Y-m-d');
    // $fechaActual = now('America/Guayaquil');
    //         $fecha_formateada = Carbon::createFromFormat('Y-m-d', $fechaActual);

    $totalVentasFechaActual = Bill::select(
        DB::raw('COALESCE(SUM(total), 0) as total')
    )->whereDate('fecha_emision', $fechaActual)
    ->first();
    
    $ventasPorFecha = Bill::select(
        DB::raw('fecha_emision as fecha'),
        DB::raw('SUM(total) as total')
    )->groupBy(DB::raw('fecha_emision'))->get();

    $ventasPorMes = Bill::select(
        DB::raw('DATE_FORMAT(fecha_emision, "%Y-%m") as mes'),
        DB::raw('SUM(total) as total')
    )->groupBy(DB::raw('DATE_FORMAT(fecha_emision, "%Y-%m")'))->get();

    $ventasPorAnio = Bill::select(
        DB::raw('YEAR(fecha_emision) as anio'),
        DB::raw('SUM(total) as total')
    )->groupBy(DB::raw('YEAR(fecha_emision)'))->get();

    return response()->json([
        'ventasHoy'=> $totalVentasFechaActual,
        'ventasPorFecha' => $ventasPorFecha,
        'ventasPorMes' => $ventasPorMes,
        'ventasPorAño' => $ventasPorAnio,
    ]);
}

}
