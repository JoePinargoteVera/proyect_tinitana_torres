import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceStorage } from 'src/app/Service/storage.service';
import { User } from 'src/app/interface/iuser';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  isCollapsed: boolean = false;
  isClientsCollapsed: boolean = false;
  isProductsCollapsed: boolean = false;
  isConfigCollapsed: boolean = false;
  user!: User;

  constructor(private router: Router, private serviceStorage: ServiceStorage){

  }

  ngOnInit(): void {
    
    this.user = this.serviceStorage.obtenerDato('user')
    
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  goProductos(){
    this.router.navigate(['/productos']);
  }

  goclientes(){
    this.router.navigate(['/clientes'])
  }

}
