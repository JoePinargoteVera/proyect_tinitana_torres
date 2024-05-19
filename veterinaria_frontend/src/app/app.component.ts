import { Component } from '@angular/core';
import { OverlayScrollbarsComponent } from "overlayscrollbars-ngx";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pozovet';
  showNavbar:boolean = true

  isCollapsed: boolean = false;
  

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
