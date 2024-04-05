import { Component } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { CategoryService } from 'src/app/Service/category.service';
import { ImagenesService } from 'src/app/Service/imagenes.service';
import { Category } from 'src/app/interface/icategory';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

  addCategory:boolean=true
  listCategory:boolean=false
  errorMessage:string = ''
  succesMessage:string = ''
  filtro:string=''
  imagenes: any[] = [];
  categoryList!:Category[]
  category:Category = {
    nombre: '',
    descripcion: ''
  }

  constructor(private categoryService:CategoryService){

  }

  showAddCategoryForm(){

    this.addCategory = true
    this.listCategory = false
  }

  showListCategories(){

    this.listCategory = true
    this.addCategory= false
    this.obtenerCategorias()
  }

  obtenerCategorias(){
    this.categoryService.listarCategorias().pipe(
      tap(data=>{
        console.log(data.data);
        this.categoryList = data.data
        
      }),
      catchError(error=>{
        this.errorMessage =  error.error.message
        return this.errorMessage
      })
    ).subscribe()
  }

  crearCategoria(){
    console.log(this.category);
    
    this.categoryService.crearCategoria(this.category).pipe(
      tap(data=>{
        console.log(data.data);
        this.succesMessage = data.message
      }),
      catchError(error =>{
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()
  }

  buscarCategorias(){

    this.categoryService.buscarCategorias(this.filtro).pipe(
      tap(data=>{
        console.log(data);
        this.categoryList = data.data
        
      }),
      catchError(error=>{
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()

  }

}
