import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { CategoryService } from 'src/app/Service/category.service';
import { ImagenesService } from 'src/app/Service/imagenes.service';
import { ProductService } from 'src/app/Service/product.service';
import { ProviderService } from 'src/app/Service/provider.service';
import { Category } from 'src/app/interface/icategory';
import { Product } from 'src/app/interface/iproduct';
import { Provider } from 'src/app/interface/iprovider';
import 'firebase/storage'
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  imagenUp:boolean = false
  loading:boolean = false
  addProduct: boolean = false
  listProduct: boolean = true
  edit:boolean = false
  errorMessage: string = ''
  succesMessage: string = ''
  filtro: string = ''
  imagenes: any[] = [];
  productosList: any
  proveedorList!: Provider[]
  categoriaList!: Category[]
  productoClear: Product = {nombre: '', pvp: 0, costo: 0, stock: 0, categoria_id: 0, proveedor_id: 0}
  producto: Product = {nombre: '', pvp: 0, costo: 0, stock: 0, categoria_id: 0, proveedor_id: 0}

  productoVer:any = {}


  constructor(private productService: ProductService, private providerService: ProviderService,
    private categoryService: CategoryService, private imagenesService: ImagenesService, private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.obtenerCategorias()
    this.obtenerProveedores()
    this.obtenerProductos()
  }

  showAddProductForm() {

    this.addProduct = true
    this.listProduct = false
    this.obtenerCategorias()
    this.obtenerProveedores()
  }

  showListProducts() {

    this.listProduct = true
    this.addProduct = false
    this.obtenerProductos()
  }

  cargarImagen(event: any) {
    this.imagenUp = true
    let archivos = event.target.files;
    for (let i = 0; i < archivos.length; i++) {
      let reader = new FileReader();

      reader.readAsDataURL(archivos[i]);
      reader.onloadend = () => {
        console.log(reader.result);
        this.imagenes.push(reader.result);
        this.imagenesService.subirImagen('products/', this.producto.nombre, reader.result).then(urlImagen => {
          console.log(urlImagen);
          this.producto.imagen = urlImagen
        });
      };
    }

    this.imagenUp = false


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

  crearProductos() {
    this.loading = true
    
    console.log(this.producto);
    
    this.productService.crearProducto(this.producto).pipe(
      tap(data => {
        console.log(data);
        
        
        this.loading = false

        
        if (data.status == '422') {

          const errors = data.validationError;

          Object.keys(errors).forEach(key => {

            const errorMessage = errors[key][0]
            this.toastr.error(errorMessage, 'Error')


          });
        } else if (data.status == '500') {
          this.toastr.error(data.message, 'Error');
        }else{
          this.toastr.success(data.message, 'Exito');
          this.producto = this.productoClear
        }
      }),
      catchError(error => {
        this.loading = false;
        this.toastr.error(error.error.message, 'Error');
        
        return error.error.message
      })
    ).subscribe()
    
    
  }

  buscarProductos() {

    this.productService.buscarProductos(this.filtro).pipe(
      tap(data => {
        console.log(data);
        this.productosList = data.data

      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()

  }

  obtenerProveedores() {
    this.providerService.listarProveedores().pipe(
      tap(data => {
        this.proveedorList = data.data
      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()
  }

  obtenerCategorias() {
    this.categoryService.listarCategorias().pipe(
      tap(data => {
        this.categoriaList = data.data

      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()
  }

  eliminarProducto(id:number){
    this.productService.eliminarProducto(id).pipe(
      tap(data=>{
        if (data.status == '404') {

            this.toastr.error(data.message, 'Error')



        } else if (data.status == '500') {
          this.toastr.error(data.message, 'Error');
        }else{
          this.obtenerProductos()
          this.toastr.success(data.message, 'Exito');
          
        }

        
      }),
      catchError(error =>{
        this.toastr.error(error.error.message, 'Error');
        return error.error.message
      })
    ).subscribe()
  }

 actualizarProducto(){
  console.log(this.productoVer);
  
  this.productService.actualizarProducto(this.productoVer).pipe(
    tap(data =>{
      console.log(data);
      

      if (data.status == '422') {

        const errors = data.validationError;

        Object.keys(errors).forEach(key => {

          const errorMessage = errors[key][0]
          this.toastr.error(errorMessage, 'Error')


        });
      } else if (data.status == '500' || data.status == '404') {
        this.toastr.error(data.message, 'Error');
      }else{
        this.toastr.success(data.message, 'Exito');
        this.obtenerProductos()
        this.edit = false
      }
    }),
    catchError(error=>{
      return error.error.message
    })
  ).subscribe()
  
}

  asignarProducto(producto:any){
    this.productoVer = producto
    
  }

  editar(){
    this.edit = true
  }

  cancelarEditar(){
    this.edit = false
  }


}
