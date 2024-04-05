import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, tap } from 'rxjs';
import { AuthService } from 'src/app/Service/auth.service';
import { ServiceStorage } from 'src/app/Service/storage.service';
import { User } from 'src/app/interface/iuser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() toggleSidebarEvent = new EventEmitter<void>();

  errorMessage : String=''
  user!: User;

  constructor(private serviceStorage: ServiceStorage, private auth: AuthService, private route:Router,
    private cookieService:CookieService){

  }
  ngOnInit(): void {
    
    this.user = this.serviceStorage.obtenerDato('user')
    
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  logOut(){
    this.auth.logout().pipe(
      tap(data=>{
        console.log(data);
        this.route.navigate(['login']);
      this.cookieService.delete('token');
        this.serviceStorage.eliminarDatos();
      }),
      // catchError(error =>{
      //   this.errorMessage = error.error.message
      // })
    ).subscribe()
  }

  
}
