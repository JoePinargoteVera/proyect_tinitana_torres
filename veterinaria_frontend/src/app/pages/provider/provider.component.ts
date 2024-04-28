import { Component } from '@angular/core';
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
export class ProviderComponent {

  loading:boolean = false
  addProvider:boolean=true
  listProvider:boolean=false
  imagenes: any[] = [];
  filtro:String = ''
  errorMessage:string = ''
  succesMessage:string = ''
  proveedorList!:Provider[]
  proveedor: Provider = {
    nombre: '',
    email: '',
    razon_social: ''
  }

  constructor(private providerService: ProviderService,  private imagenesService: ImagenesService, 
    private toastr: ToastrService){

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
}
