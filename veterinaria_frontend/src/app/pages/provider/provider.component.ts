import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';
import { ImagenesService } from 'src/app/Service/imagenes.service';
import { ProviderService } from 'src/app/Service/provider.service';
import { Provider } from 'src/app/interface/iprovider';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {

  loading:boolean = false
  edit:boolean = false
  addProvider:boolean=false
  listProvider:boolean=true
  imagenes: any[] = [];
  filtro:String = ''
  errorMessage:string = ''
  succesMessage:string = ''
  productosProveedor:any = []
  proveedorList!:Provider[]
  proveedorClear: Provider = {nombre: '',email: '',razon_social: ''}
  proveedor: Provider = {nombre: '',email: '',razon_social: ''}

  constructor(private providerService: ProviderService,  private imagenesService: ImagenesService, 
    private toastr: ToastrService){

  }
  ngOnInit(): void {
    this.obtenerProveedores()
  }

  showAddProviderForm(){

    this.addProvider = true
    this.listProvider = false
  }

  showListPRoviders(){

    this.listProvider = true
    this.addProvider= false
    this.obtenerProveedores()
  }

  obtenerProveedores(){
    this.providerService.listarProveedores().pipe(
      tap(data=>{      
        this.proveedorList = data.data
        console.log(data);
        
      }),
      catchError(error=>{
        this.errorMessage = error.error.message
        return  this.errorMessage
      }) 
    ).subscribe()

  }

  editar() {
    this.edit = true
  }


  cancelarEditar() {
    this.edit = false
  }
  actualizarProveedor(){

    console.log(this.proveedor);

    this.providerService.actualizarProveedor(this.proveedor).pipe(
      tap(data => {
        console.log(data);


        if (data.status == '422') {

          const errors = data.validationError;

          Object.keys(errors).forEach(key => {

            const errorMessage = errors[key][0]
            this.toastr.error(errorMessage, 'Error')


          });
        } else if (data.status == '500' || data.status == '404') {
          this.toastr.error(data.message, 'Error');
        } else {
          this.toastr.success(data.message, 'Exito');
          this.obtenerProveedores()
          this.edit = false
        }
      }),
      catchError(error => {
        return error.error.message
      })
    ).subscribe()

  }

  obtenerProductos(id:any){
    this.providerService.listarProductos(id).pipe(
      tap(data =>{
        this.productosProveedor = data.data
      }),
      catchError(error =>{
        return error.message
      })
    ).subscribe()
  }

  buscarProveedores(){
    this.providerService.buscarProveedores(this.filtro).pipe(
      tap(data=>{

        this.proveedorList = data.data
      }),
      catchError(error=>{
        this.errorMessage = error.error.message
        return  this.errorMessage
      }) 
    ).subscribe()

  }

  crearProveedor(){
    this.loading = true
    
    this.providerService.crearProveedor(this.proveedor).pipe(
      tap(data=>{
        this.loading = false
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
          this.proveedor = this.proveedorClear
        }
        
      }),
      catchError(error=>{
        this.loading = false
        this.errorMessage = error.error.error       
        return  this.errorMessage
      }) 
    ).subscribe()
  }

  cargarImagen(event: any) {
    let archivos = event.target.files;

    for (let i = 0; i < archivos.length; i++) {
      let reader = new FileReader();

      reader.readAsDataURL(archivos[i]);
      reader.onloadend = () => {
        console.log(reader.result);
        this.imagenes.push(reader.result);
        this.imagenesService.subirImagen('providers/', this.proveedor.nombre, reader.result).then(urlImagen => {
          console.log(urlImagen);
          this.proveedor.imagen = urlImagen
        });
      };
    }

  }

  asignarProveedor(user:Provider){
    this.proveedor = user
    console.log(this.proveedor);
  }
  cerrar(){
    this.proveedor = this.proveedorClear
  }
}
