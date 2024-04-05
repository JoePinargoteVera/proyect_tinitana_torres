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

  archivos: any
  addProduct: boolean = true
  listProduct: boolean = false
  errorMessage: string = ''
  succesMessage: string = ''
  filtro: string = ''
  imagenes: any[] = [];
  productosList: any
  proveedorList!: Provider[]
  categoriaList!: Category[]
  producto: any = {}


  constructor(private productService: ProductService, private providerService: ProviderService,
    private categoryService: CategoryService, private imagenesService: ImagenesService, private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.obtenerCategorias()
    this.obtenerProveedores()
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
    this.archivos = event.target.files;



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
    // if (this.archivos !== null) {
    //   for (let i = 0; i < this.archivos.length; i++) {
    //     let reader = new FileReader();

    //     reader.readAsDataURL(this.archivos);
    //     reader.onloadend = () => {
    //       this.imagenes.push(reader.result);
    //       this.imagenesService.subirImagen('images/', this.producto.nombre, reader.result).then(urlImagen => {
    //         console.log(urlImagen);
    //         this.producto.imagen = urlImagen
    //       });
    //     };
    //   }
    // }

      console.log(this.producto);

    this.productService.crearProducto(this.producto).pipe(
      tap(data => {
        console.log(data);
        // this.succesMessage = 

        
        this.toastr.success(data.error, 'Éxito');
      }),
      catchError(error => {
        this.errorMessage = error.error.message
        this.toastr.error(this.errorMessage, 'Error');
        return this.errorMessage
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
        console.log(data.data);
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
        console.log(data.data);
        this.categoriaList = data.data

      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()
  }
}
