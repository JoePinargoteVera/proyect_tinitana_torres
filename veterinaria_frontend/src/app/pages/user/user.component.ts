import { Binary } from '@angular/compiler';
import { Component } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { UserService } from 'src/app/Service/user.service';
import { User } from 'src/app/interface/iuser';
import { ImagenesService } from 'src/app/Service/imagenes.service';
import 'firebase/storage'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

 
  archivos:any
  imagenes: any[] = [];
  base64Image: string  = '';
  filtro: String = ''
  addUser: boolean = true
  listUser: boolean = false
  errorMessage: string = ''
  succesMessage: string = ''
  userList!: User[]
  user: User = {
    name: '',
    password: '',
    email: '',
    rol: '',
    imagen: null
  }

  constructor(private userService: UserService, private imagenesService: ImagenesService, private sanitizer: DomSanitizer) { }

  getUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  cargarImagen(event: any) {
    this.archivos = event.target.files;

    

  }

  showAddUserForm() {

    this.addUser = true
    this.listUser = false
  }

  showListUsers() {

    this.listUser = true
    this.addUser = false
    this.obtenerUsuarios()
  }

  obtenerUsuarios() {
    this.userService.listarUsuarios().pipe(
      tap(data => {
        this.userList = data.data
        console.log(data);

      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()

  }

  buscarUsuarios() {
    this.userService.buscarUsuarios(this.filtro).pipe(
      tap(data => {

        this.userList = data.data
      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()

  }

  crearUsuario() {

    for (let i = 0; i < this.archivos.length; i++) {
      let reader = new FileReader();

      reader.readAsDataURL(this.archivos[i]);
      reader.onloadend = () => {
        console.log(reader.result);
        this.imagenes.push(reader.result);
        this.imagenesService.subirImagen('images/' , this.user.name + Date.now(), reader.result).then(urlImagen => {
          console.log(urlImagen);
          this.user.imagen = urlImagen
        });
      };
    }

      this.userService.crearUsuario(this.user).pipe(
        tap(data => {
          this.succesMessage = data.message
          console.log(data.data);
          console.log(this.succesMessage);
          
        }),
        catchError(error => {
          this.errorMessage = error.error.message
          console.log(error.error.error);
          console.log(this.errorMessage);
          
          return this.errorMessage
        })
      ).subscribe()    

  }

}
