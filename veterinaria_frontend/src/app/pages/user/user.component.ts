import { Binary } from '@angular/compiler';
import { Component } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { UserService } from 'src/app/Service/user.service';
import { User } from 'src/app/interface/iuser';
import { ImagenesService } from 'src/app/Service/imagenes.service';
import 'firebase/storage'
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {


  loading: boolean = false
  archivos: any
  imagenes: any[] = [];
  base64Image: string = '';
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

  constructor(private userService: UserService, private imagenesService: ImagenesService,
    private sanitizer: DomSanitizer, private toastr: ToastrService) { }

  getUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  cargarImagen(event: any) {
    let archivos = event.target.files;
    for (let i = 0; i < archivos.length; i++) {
      let reader = new FileReader();

      reader.readAsDataURL(archivos[i]);
      reader.onloadend = () => {
        console.log(reader.result);
        this.imagenes.push(reader.result);
        this.imagenesService.subirImagen('users/', this.user.name + Date.now(), reader.result).then(urlImagen => {
          console.log(urlImagen);
          this.user.imagen = urlImagen
        });
      };
    }


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
    this.loading = true

    this.userService.crearUsuario(this.user).pipe(
      tap(data => {

        this.loading = false
        if (data.status == '422') {

          const errors = data.validationError;

          Object.keys(errors).forEach(key => {

            const errorMessage = errors[key][0]
            this.toastr.warning(errorMessage, 'Error')


          });
        } else if (data.status == '500') {
          this.toastr.error(data.error, 'Error');
        } else {
          this.toastr.success(data.message, 'Exito');
        }
        this.succesMessage = data.message




      }),
      catchError(error => {
        this.errorMessage = error.error.message
        this.loading = false
        this.toastr.error(error.error.message, 'Error');

        return this.errorMessage
      })
    ).subscribe()

  }

}
