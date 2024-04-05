import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { BillService } from 'src/app/Service/bill.service';
import { ClientService } from 'src/app/Service/client.service';
import { ProductService } from 'src/app/Service/product.service';
import { TransactionService } from 'src/app/Service/transaction.service';
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
export class HomeComponent implements OnInit{

  chartOptions!: ChartOptions;

  errorMessage: string = ''
  selectedProduct!: number;
  productosList!: Product[];
  chartData!: number[];
  customerData!: any[];
  salesData!: any[];
  revenueData!: any[];

  selectedFilter: string = 'month';
  view: [number, number] = [700, 400];
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5']
  };

  constructor(private productService: ProductService, private customerService: ClientService,
    private salesService: BillService, private appComponent: AppComponent) {
    appComponent.showNavbar = true
    this.obtenerProductos();

    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "line"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: "straight",
        dashArray: [0, 8, 5]
      },
      xaxis: {
        type: "datetime",

      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val: string) {
                return val + " (mins)";
              }
            }
          },
          {
            title: {
              formatter: function (val: string) {
                return val + " per session";
              }
            }
          },
          {
            title: {
              formatter: function (val: any) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: "#f1f1f1"
      },
      title: {
        text: "sensores"
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
    };
    const now = new Date();
    const startDate = new Date(now.getTime());
    const endDate = new Date(startDate.getTime() + 15 * 60000);

    this.chartOptions.series = [
      {
        name: 'humedad',
        data: [2,5,8,9,4,3,4]
        // data: this.productosList.map((valor, index) => ({
        //   x: new Date(now.getMinutes() + index * 60000),
        //   y: valor
        // }))

      },
      {
        name: 'temperatura',
        data: [4,5,7,1,0,2,6]
        // data: this.productosList.map((valor, index) => ({
        //   x: new Date(now.getMinutes() + index * 60000), // Asegúrate de ajustar el intervalo de tiempo adecuadamente
        //   y: valor
        // }))

      }
    ],
      this.chartOptions.xaxis = {

        type: "datetime",
        min: startDate.getTime(),
        max: endDate.getTime(),
        // range: now.getMinutes()*6000,
        labels: {
          datetimeFormatter: {
            hour: "HH:mm"
          }
        }
      }

  }
  ngOnInit(): void {
  
  }

  obtenerProductos() {

    this.productService.listarProductos().pipe(
      tap(data => {
        console.log(data.data);
        this.productosList = data.data
        this.inicializarChartSeries()
      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()
  }

  inicializarChartSeries() {
    const now = new Date();
    const startDate = new Date(now.getTime());
    const endDate = new Date(startDate.getTime() + 15 * 60000);
  
    this.chartOptions.series = [
      {
        name: 'humedad',
        data: this.productosList.map((valor, index) => ({
          x: new Date(now.getMinutes() + index * 60000),
          y: valor
        }))
      },
      {
        name: 'temperatura',
        data: this.productosList.map((valor, index) => ({
          x: new Date(now.getMinutes() + index * 60000),
          y: valor
        }))
      }
    ];
  
    // Resto de la inicialización del gráfico...
  }

}
