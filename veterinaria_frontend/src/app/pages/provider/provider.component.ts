import { Component } from '@angular/core';
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

  constructor(private providerService: ProviderService,  private imagenesService: ImagenesService){

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
    console.log(this.proveedor);
    
    this.providerService.crearProveedor(this.proveedor).pipe(
      tap(data=>{
        this.succesMessage = data.message
        console.log(data);
        
      }),
      catchError(error=>{
        this.errorMessage = error.error.error
        console.log(this.errorMessage);
        
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
        this.imagenesService.subirImagen('products', this.proveedor.nombre + Date.now(), reader.result).then(urlImagen => {
          console.log(urlImagen);
          this.proveedor.imagen = urlImagen
        });
      };
    }

  }
}
