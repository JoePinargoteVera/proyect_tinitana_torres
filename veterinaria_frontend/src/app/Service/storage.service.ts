import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { User } from '../interface/iuser'

@Injectable({
  providedIn: 'root'
})
export class ServiceStorage {

  constructor(@Inject(LOCAL_STORAGE) private serviceStorage: StorageService) { }

  //guardar el usuario en el local storage
  guardarObjeto(nombreDato: string, user: User): void {
    this.serviceStorage.set(nombreDato, user);
  }

  //guardar un dato del local storage
  guardarDato(nombreDato: any, dato:any): void {
    this.serviceStorage.set(nombreDato, dato);
  }

  // Obtener un dato del Local Storage
  obtenerDato(nombreDato: string): any {
    return this.serviceStorage.get(nombreDato);
  }

  // Eliminar un dato del Local Storage
  eliminarDato(nombreDato: string): void {
    this.serviceStorage.remove(nombreDato);
  }

  eliminarDatos(): void {
    this.serviceStorage.clear()
  }
}
