import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { url } from '../app.module';
import { IResNotification } from '../interface/inotification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  listarNotificaciones():Observable<IResNotification>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResNotification>(`${url}notificacion/listar`, options);
  }

  listarNoLeidas():Observable<IResNotification>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResNotification>(`${url}notificacion/listar_no_leidas`, options);
  }

  read_at(id:number):Observable<IResNotification>{
    let body = {}
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.post<IResNotification>(`${url}notificacion/read_at?id=${id}`,body = {id : id}, options);
  }
}
