import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { ProductService } from 'src/app/Service/product.service';
import { Product } from 'src/app/interface/iproduct';
import { PaginationInstance, PaginationService } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  sortKey: string = 'asc';
  sortDirection: string = '';
  pageSize: number = 7;
  currentPage: number = 1;
  searchTerm: string = '';
  errorMessage: string = ''
  succesMessage: string = ''
  filtro: string = ''
  imagenes: any[] = [];
  productosList!: Product[]
  cantidad:number = 0
  id:number = 0

  constructor(private productService: ProductService, private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.obtenerProductos()
  }

  obtenerId(id:any){
    this.id = id
  }

  aniadirStock(){
    console.log(this.id, this.cantidad);
    
    this.productService.incrementar(this.id, this.cantidad).pipe(
      tap(data =>{
        console.log(data);
        this.obtenerProductos()
        
      }),
      catchError(error =>{
        console.log(error);
        
        return error.message
      })
    ).subscribe()
  }

  quitarStock(){
    this.productService.decrementar(this.id, this.cantidad).pipe(
      tap(data =>{
        console.log(data);
        this.obtenerProductos()
        
      }),
      catchError(error =>{
        console.log(error);
        
        return error.message
      })
    ).subscribe()
  }

  

  eliminarProducto(id:number | undefined){
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



  get filteredProducts() {

    return this.productosList.filter((product) =>
      product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sort(key: string) {
    if (!this.productosList || this.productosList.length === 0) {
      return;
    }
    // Cambia la dirección de ordenamiento si ya se está ordenando por la misma clave
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    // console.log(this.filteredProducts);


    // Implementa la lógica de ordenamiento según la clave (key)
    this.productosList.sort((a, b) => {

      const valA = this.getPropertyValue(a, key);
      const valB = this.getPropertyValue(b, key);

      const numericValA = key === 'pvp' ? parseFloat(valA) : valA;
      const numericValB = key === 'pvp' ? parseFloat(valB) : valB;

      return this.compareValues(numericValA, numericValB, this.sortDirection);
    });

    // this.config.currentPage = 1;
  }

  getPropertyValue(object: any, key: string) {
    if (key.includes('.')) {
      const keys = key.split('.');
      return keys.reduce((obj, currentKey) => obj[currentKey], object);
    }
    return object[key];
  }

  compareValues(valueA: any, valueB: any, direction: string) {
    if (valueA < valueB) {
      return direction === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  }

}
