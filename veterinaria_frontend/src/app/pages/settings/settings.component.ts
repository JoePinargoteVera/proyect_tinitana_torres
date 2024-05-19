import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { SettingsService } from 'src/app/Service/settings.service';
import { Setting } from 'src/app/interface/isetting';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  configuracion:Setting = {
    id: 0,
    iva: 0,
    stock_minimo: 0,
    ruc: '',
    email: '',
    imagen: ''
  }
  
  constructor(private settingService:SettingsService){}
  
  ngOnInit(): void {

    this.obtenerConfiguracion()
    
  }

  obtenerConfiguracion(){
    this.settingService.verConfiguracion().pipe(
      tap(data=>{
        this.configuracion = data.setting
        console.log(data);
        
      }),
      catchError(error =>{
        return error.message
      })
    ).subscribe()
  }

}
