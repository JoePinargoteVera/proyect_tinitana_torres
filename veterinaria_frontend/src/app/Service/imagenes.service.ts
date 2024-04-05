import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import { AppSettings } from 'appsettings-json-reader';

const appSettings = AppSettings.readAppSettings();
firebase.initializeApp(appSettings.firebaseConfig)

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  storageRef = firebase.app().storage().ref();
  constructor() { }

  async subirImagen(folder:string, nombre: string, imgBase64: any){
    try {
      let respuesta = await this.storageRef.child(folder+nombre).putString(imgBase64,'data_url')
      console.log(respuesta);
      return await respuesta.ref.getDownloadURL();
    } catch (error) {
      console.log(error);
      return null
    }
    // const reference = this.storage.ref(imgBase64)
  }
}
