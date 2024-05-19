import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';
import { CategoryService } from 'src/app/Service/category.service';
import { Category } from 'src/app/interface/icategory';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  loading:boolean = false
  addCategory:boolean=false
  listCategory:boolean=true
  errorMessage:string = ''
  succesMessage:string = ''
  filtro:string=''
  imagenes: any[] = [];
  categoryList!:Category[]
  category:Category = {nombre: '',descripcion: '' }
  categoryClear:Category = {nombre: '',  descripcion: ''  }

  constructor(private categoryService:CategoryService, private toastr: ToastrService){

  }
  ngOnInit(): void {
    this.obtenerCategorias()
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
    this.loading = true
    
    this.categoryService.crearCategoria(this.category).pipe(
      tap(data=>{
        this.loading = false
        console.log(data);
        

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
          this.category = this.categoryClear
        }

      }),
      catchError(error =>{
        this.loading = false
        // this.toastr.error(error.error.error, 'Error');
        return error.error.message
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
