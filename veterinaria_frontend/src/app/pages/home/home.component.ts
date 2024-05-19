import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { BillService } from 'src/app/Service/bill.service';
import { ClientService } from 'src/app/Service/client.service';
import { ProductService } from 'src/app/Service/product.service';
import { AppComponent } from 'src/app/app.component';
import Chart from 'chart.js/auto';


import { Product } from 'src/app/interface/iproduct';
import { Client } from 'src/app/interface/iclient';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/Service/dashboard.service';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  errorMessage: string = ''
  clientesList: Client[] = [];
  cantidadClientes: number = 0;
  productosList!: Product[];
  ventaActual:number=0  


  constructor(private productService: ProductService, private clienteService: ClientService,
    private billService: BillService, private dashboard:DashboardService, private appComponent: AppComponent, private toastr: ToastrService) {
    appComponent.showNavbar = true


  }
  ngOnInit(): void {

    this.obtenerCliente()
    this.obtenerProductos()
    this.ventasChart()
    this.ventasProductosChart()
  }

  ventasChart() {
   this.dashboard.listarVentas().pipe(
    tap(data=>{

      this.ventaActual = data.ventasHoy.total
      
      const ctx = document.getElementById('chart1') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'bar',
        data: {
          // labels: data.mes.map((venta: { mes: any; }) => venta.mes),
          labels: data.ventasPorFecha.map((venta: any) => venta.fecha),
          datasets: [
            {
              label: 'Ventas por Fecha',
              data: data.ventasPorFecha.map((venta: any) => parseFloat(venta.total)),
              backgroundColor: 'rgba(75, 182, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            // {
            //   label: 'Ventas por Mes',
            //   data: data.ventasPorMes.map((venta: any) => parseFloat(venta.total)),
              // backgroundColor: 'rgba(255, 99, 132, 0.5)',
              // borderColor: 'rgba(255, 99, 132, 1)',
            //   borderWidth: 1
            // }
    
        ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

    }),
    catchError(error=>{
      return error.message
    })
   ).subscribe()
  }

  ventasProductosChart() {
    this.dashboard.listarVentasProductos().pipe(
     tap(data=>{
 
      const labels = data.map((item: any) => item.nombre_producto);
      const totals = data.map((item: any) => parseFloat(item.total_generado));
    
      const ctx = document.getElementById('chart2') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total por Producto sin IVA ',
            data: totals,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
 
     }),
     catchError(error=>{
       return error.message
     })
    ).subscribe()
   }
  


  obtenerCliente() {
    this.clienteService.listarClientes().pipe(
      tap(data => {
        this.clientesList = data.data
        this.cantidadClientes = this.clientesList.length
      }),
      catchError(error => {
        return error.message
      })
    ).subscribe()
  }

  obtenerProductos() {

    this.productService.listarProductos().pipe(
      tap(data => {
        console.log(data.data);
        this.productosList = data.data
      }),
      catchError(error => {
        this.errorMessage = error.message
        return this.errorMessage
      })
    ).subscribe()
  }

}
