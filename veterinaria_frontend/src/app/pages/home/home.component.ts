import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { BillService } from 'src/app/Service/bill.service';
import { ClientService } from 'src/app/Service/client.service';
import { ProductService } from 'src/app/Service/product.service';
import { AppComponent } from 'src/app/app.component';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexStroke
} from "ng-apexcharts";
import { Product } from 'src/app/interface/iproduct';
import { Client } from 'src/app/interface/iclient';
import { ToastrService } from 'ngx-toastr';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // chartOptions!: ChartOptions;

  errorMessage: string = ''
  clientesList: Client[] = [];
  cantidadClientes: number = 0;
  productosList!: Product[];
  // chartData!: number[];
  // customerData!: any[];
  // salesData!: any[];
  // revenueData!: any[];

  selectedFilter: string = 'month';
  view: [number, number] = [700, 400];
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5']
  };

  constructor(private productService: ProductService, private clienteService: ClientService,
    private billService: BillService, private appComponent: AppComponent, private toastr: ToastrService) {
    appComponent.showNavbar = true


  }
  ngOnInit(): void {

    this.obtenerCliente()
  }



  obtenerCliente() {
    this.clienteService.listarClientes().pipe(
      tap(data => {
        this.clientesList = data.data
        this.cantidadClientes = this.clientesList.length
      }),
      catchError(error =>{
        return error.error.message
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
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()
  }

}
