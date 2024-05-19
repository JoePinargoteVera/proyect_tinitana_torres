import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, tap } from 'rxjs';
import { AuthService } from 'src/app/Service/auth.service';
import { NotificationService } from 'src/app/Service/notification.service';
import { ServiceStorage } from 'src/app/Service/storage.service';
import { Notification } from 'src/app/interface/inotification';
import { User } from 'src/app/interface/iuser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() toggleSidebarEvent = new EventEmitter<void>();

  errorMessage : String=''
  notificacionMensage:string = ''
  notificacionCantidad:number = 0
  notificacionesList: Notification[] = []
  user!: User;

  constructor(private serviceStorage: ServiceStorage, private auth: AuthService, private route:Router,
    private cookieService:CookieService, private notificationService:NotificationService){

  }
  ngOnInit(): void {
    
    this.user = this.serviceStorage.obtenerDato('user')
    
    this.obtenerNotificaciones()

    setInterval(() => {
      this.obtenerNotificaciones();
    }, 30000);
    
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  obtenerNotificaciones(){
    this.notificationService.listarNoLeidas().pipe(
      tap(data=>{
        console.log(data);
        this.notificacionesList = data.data
        this.notificacionMensage = data.message
        this.notificacionCantidad = data.data.length
        
      }),
      catchError(error=>{
        console.log(error.message);
        
        return error.message
      })
    ).subscribe()
  }

  abrirModal(notificacion:Notification){

    // this.notificacionMensage = notificacion.mensaje
    const id = notificacion.id

    if (notificacion.id !== undefined) {
      console.log(notificacion);
      
      this.notificationService.read_at(notificacion.id).pipe(
        tap(data=>{
          console.log(data);
          this.obtenerNotificaciones()
        }),
        catchError(error=>{
          console.log(error);
          
          console.log(error.message);
          
          return error.message
        })
      ).subscribe()
    }
  }

  logOut(){
    this.auth.logout().pipe(
      tap(data=>{
        console.log(data);
        this.route.navigate(['login']);
      this.cookieService.delete('token');
        this.serviceStorage.eliminarDatos();
      }),
      catchError(error =>{
        this.errorMessage = error.error.message
        return error
      })
    ).subscribe()
  }

  
}
