import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { ProductService } from 'src/app/Service/product.service';
import { Product } from 'src/app/interface/iproduct';
import { PaginationInstance, PaginationService } from 'ngx-pagination';

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

  constructor(private productService: ProductService, private paginationService: PaginationService) {

  }
  ngOnInit(): void {
    this.obtenerProductos()
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
