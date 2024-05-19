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
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';




// import { Select, initMDB } from "mdb-ui-kit";

// initMDB({ Select });

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  [x: string]: any;

  mostrarModal: boolean = false
  loading: boolean = false
  addClient: boolean = false
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
  productosReservados:any []= []
  transaccion: any = {}
  cliente: any = {}
  value2 = '1';

  nuevoCliente: Client = { id: 0, cedula: '', nombres: '', apellidos: '', email: '', estado: false }
  factura: any = {}
  facturagenerada: any = {}

  idFactura: number = 0
  mostrar: boolean = false;
  datosCargando: boolean = true;
  facturaEnviada: boolean = false;

  constructor(private productService: ProductService, private clienteService: ClientService,
    private transaccionService: TransactionService, private billService: BillService,
    private serviceStorage: ServiceStorage, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.user = this.serviceStorage.obtenerDato('user')
    this.listarClientes();




  }
  get nombresCompletos() {
    return this.clienteList.map(cliente => ({
      id: cliente.id,
      nombreCompleto: `${cliente.nombres} ${cliente.apellidos}`
    }));
  }

  guardarNuevoCliente() {
    this.loading = true
    this.clienteService.crearCliente(this.cliente).pipe(
      tap(data => {

        if (data.validationError && data.validationError["cedula"]) {
          console.log(data.validationError["cedula"]);

          this.generarTransaccion()
          this.loading = false
        } else if (data.status == '201') {

          this.transaccion.cliente_id = data.cliente.id

          this.loading = false
          this.generarTransaccion()
        } else if (data.status == '500') {
          this.toastr.error(data.message, 'Error');
          this.loading = false
        }
        this.loading = false
      }), catchError(error => {
        this.loading = false
        console.log(error);


        return error
      })
    ).subscribe()
  }

  asignar() {
    if (this.transaccion.cliente_id) {
      this.cliente = this.clienteList.find(cliente => cliente.id === this.transaccion.cliente_id);
      if (this.cliente) {
        console.log(this.cliente);
      } else {
        console.log('Cliente no encontrado');
      }
    } else {
      // Si el cliente_id es null o undefined, establece this.cliente como vacío
      this.cliente = {};
    }
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
        this.clienteList = data.data

      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()
  }

  agreagarCliente() {
    this.addClient = true
  }
  agregarProducto(producto: Product) {

    this.productos.push(producto)
    console.log(this.productos);
    this.filtro = ''

  }

  reservar(){
    const objeto = {productos:this.productos, cliente:this.cliente}
    this.productosReservados.push(objeto)

    this.productos = []
    this.cliente = {}
  }

  retornar(reserva:any){

    this.productosReservados = this.productosReservados.filter(obj => obj.cliente.id !== reserva.cliente.id);

    this.productos = reserva.productos
    this.cliente = reserva.cliente
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
        this.transaccion.transaccion_id = data.transaccion.id
        this.transaccion.user_id = this.user.id
        this.transaccion.estado = true

        this.transaccion.iva = (this.calcularTotalGeneral() * 15) / 100

        //crear factura
        this.generarFactura()

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

  generarFactura() {
    this.billService.crearFactura(this.transaccion).pipe(
      tap(data => {
        console.log(data);
        this.facturagenerada = data.factura
        this.idFactura = data.factura.id
        this.datosCargando = false;
        this.loading = false
        this.mostrarModal = true

        if (data.status == '422') {

          const errors = data.validationError;

          Object.keys(errors).forEach(key => {

            const errorMessage = errors[key][0]
            this.toastr.warning(errorMessage, 'Error')


          });
        } else if (data.status == '500') {
          this.toastr.error(data.error, 'Error');
        } else {
          this.toastr.success(data.message, 'Exito');
        }

      }),
      catchError(error => {
        this.errorMessage = error.error.message

        this.toastr.error(error.error.message, 'Error');

        return this.errorMessage
      })
    ).subscribe()
  }

  // enviarFactura() {
  //   console.log(this.idFactura);

  //   this.billService.enviarFactura(this.idFactura).pipe(
  //     tap(data => {

  //       console.log(data);

  //       this.toastr.success(data.message, 'Éxito');

  //     }),
  //     catchError(error => {
  //       console.log(error.error);

  //       this.toastr.error(error.error.error, 'Error');
  //       return error.error.error
  //     })
  //   ).subscribe()
  // }

  quitarProducto(id: number) {
    this.productos = this.productos.filter(obj => obj.id !== id);
  }

  onOptionChange(event: any): void {
    console.log('Selected option:', this.transaccion.cliente_id);
    // Puedes agregar lógica adicional aquí
  }

  generarPDF(cliente: string) {

    // Carga las fuentes de pdfMake
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

    // Define el contenido HTML que deseas incluir en el PDF
    const contenidoHTML: any = document.getElementById('invoice');

    const options = {
      background: 'white',
      scale: 4
    }

    html2canvas(contenidoHTML, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/PNG');
      const pdf = new jsPDF('p','pt','a4');
      const bufferX = 15
      const bufferY = 15
      const imgProp = (pdf as any).getImageProperties(imgData)
      const width = pdf.internal.pageSize.getWidth() - 2 * bufferX;
      const height = (imgProp.height * width) / imgProp.width;

      pdf.addImage(imgData, 'PNG', bufferX, bufferY, width, height, undefined, 'FAST');

      const pdfBlob = pdf.output('blob'); // Convertir el PDF a un Blob

      const formData = new FormData();
      formData.append('cliente', cliente);
      formData.append('pdfFile', pdfBlob, `_${cliente}.pdf`);

      this.billService.enviarFactura(this.idFactura, formData).pipe(
        tap(data => {
  
          console.log(data);
  
          this.toastr.success(data.message, 'Éxito');
  
        }),
        catchError(error => {
          console.log(error);
  
          this.toastr.error(error.message, 'Error');
          return error.error.error
        })
      ).subscribe()
    });
  }

  generarPDFMake() {
    const doc = new jsPDF();
    
    // Contenido HTML que quieres agregar al PDF
    const contenidoHTML: any = document.getElementById('invoice')?.innerHTML;
    
    // Agregar el contenido HTML al PDF
    doc.html(contenidoHTML, {
      callback: (doc) => {
        // Al agregar el contenido, puedes guardar el PDF o mostrarlo en el navegador
        doc.save('mi_pdf.pdf'); // Guardar el PDF con un nombre específico
        // doc.output('dataurlnewwindow'); // Mostrar el PDF en una nueva ventana del navegador
      }
    });
  }
}


