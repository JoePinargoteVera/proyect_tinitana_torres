import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Client, IResClient } from '../interface/iclient';
import { Observable } from 'rxjs';
import { url } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) { }

  listarClientes():Observable<IResClient>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResClient>(`${url}cliente/listar`, options);
  }

  verCliente(id:number):Observable<IResClient>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResClient>(`${url}cliente/ver?id=${id}`,options);
  }

  crearCliente(body: Client):Observable<IResClient>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.post<IResClient>(`${url}cliente/crear`,body,options)
  }

  buscarClientes(filtro:any):Observable<IResClient>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResClient>(`${url}cliente/buscar?filtro=${filtro}`, options);
  }

  actualizarCliente(body: any):Observable<IResClient>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.put<IResClient>(`${url}cliente/actualizar`, body, options)
  }

  eliminarCliente(id: number):Observable<IResClient>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.delete<IResClient>(`${url}cliente/eliminar?id=${id}`)
  }
}
