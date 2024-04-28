import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';
import { BillService } from 'src/app/Service/bill.service';
import { ClientService } from 'src/app/Service/client.service';
import { ProductService } from 'src/app/Service/product.service';
import { ServiceStorage } from 'src/app/Service/storage.service';
import { TransactionService } from 'src/app/Service/transaction.service';
import { Client } from 'src/app/interface/iclient';
import { Product } from 'src/app/interface/iproduct';
// import { Select, initMDB } from "mdb-ui-kit";

// initMDB({ Select });

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  [x: string]: any;

  email: string = 'pozovet@gmail.com'
  filtro: any
  totalGeneral: number = 0
  user: any
  cantidad: number = 1
  errorMessage: string = ''
  succesMessage: string = ''
  productosList!: Product[]
  clienteList: Client[] = []
  productos: any[] = []
  transaccion: any = {}
  cliente: any = { }

  nuevoCliente:Client = {
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    estado: false
  }
  factura: any = {}
  facturagenerada: any = {}

  idFactura:number = 0
  mostrar: boolean = false;
  datosCargando: boolean = true;
  facturaEnviada:boolean = false;

  constructor(private productService: ProductService, private clienteService: ClientService,
    private transaccionService: TransactionService, private billService: BillService,
    private serviceStorage: ServiceStorage, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.user = this.serviceStorage.obtenerDato('user')
    this.listarClientes()
  }

  guardarNuevoCliente(){
    this.clienteService.crearCliente(this.nuevoCliente).pipe(
      tap(data=>{
        console.log(data);
        
      }),catchError(error => {
        return error.error.message
      })
    ).subscribe()
  }

  buscarProductos() {

    this.productService.buscarProductos(this.filtro).pipe(
      tap(data => {
        // console.log(data);
        this.productosList = data.data

      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()

  }

  listarClientes() {
    this.clienteService.listarClientes().pipe(
      tap(data => {
        // console.log(data);
        this.clienteList = data.data

      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()
  }

  agregarProducto(producto: Product) {

    this.productos.push(producto)
    console.log(this.productos);
    this.filtro = ''

  }

  calcularTotal(producto: any) {
    producto.total = producto.cantidad * producto.pvp;
  }

  calcularTotalGeneral() {

    let totalGeneral = 0
    for (const producto of this.productos) {
      totalGeneral += producto.total || 0;
    }

    return totalGeneral;
  }

  generarTransaccion() {
    if (this.productos == null) {
      return
    }

    this.transaccion.productos = this.productos

    //crear transaccion
    this.transaccionService.crearTransaccion(this.transaccion).pipe(
      tap(data => {

        if (data.status == '422') {

          const errors = data.validationError;

          Object.keys(errors).forEach(key => {

            const errorMessage = errors[key][0]
            this.toastr.warning(errorMessage, 'Error')


          });
        } else if (data.status == '500') {
          this.toastr.error(data.error, 'Error');
        }

        // asignacion de datos para crear factura
        this.transaccion.transaccion_id =data.transaccion.id
        this.transaccion.user_id = this.user.id
        this.transaccion.estado = true

        this.transaccion.iva = (this.calcularTotalGeneral() * 15) / 100

        //crear factura
        this.billService.crearFactura(this.transaccion).pipe(
          tap(dato => {
            console.log(dato);
            this.facturagenerada = dato.factura
            this.idFactura = dato.factura.id
            this.datosCargando = false;

            if (data.status == '422') {

              const errors = data.validationError;
    
              Object.keys(errors).forEach(key => {
    
                const errorMessage = errors[key][0]
                this.toastr.warning(errorMessage, 'Error')
    
    
              });
            } else if (data.status == '500') {
              this.toastr.error(data.error, 'Error');
            }else{
              this.toastr.success(data.message, 'Exito');
            }

          }),
          catchError(error => {
            this.errorMessage = error.error.message

            this.toastr.error(error.error.message, 'Error');

            return this.errorMessage
          })
        ).subscribe()
      }),
      catchError(error => {
        this.errorMessage = error.error
        this.toastr.error(error.error.message, 'Error');

        return this.errorMessage
      })
    ).subscribe()
  }

  asignarCliente() {
    console.log(this.transaccion.cliente_id);
    const id = parseInt(this.transaccion.cliente_id)

    this.cliente = this.clienteList.find(cliente => cliente.id === id)
    console.log(this.cliente);
  }

  enviarFactura(){
    console.log(this.idFactura);
    
    this.billService.enviarFactura(this.idFactura).pipe(
      tap(data=>{
        
        console.log(data);
        
        this.toastr.success(data.message, 'Éxito');

      }),
      catchError(error=>{
        console.log(error.error);
        
        this.toastr.error(error.error.message, 'Error');
        return error.error.message
      })
    ).subscribe()
  }

}


