import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { IResUser, User } from '../interface/iuser';
import { Observable } from 'rxjs';
import { url } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) { }

  // registrarUsuario(body: User): Observable<IResUser> {
  //   const token = this.cookieService.get('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   const options = { headers: headers };
  //   return this.http.post<IResUser>(`${url}user/crear`, body)
  // }
  // updateUser(body: User): Observable<IResUser> {
  //   const token = this.cookieService.get('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   const options = { headers: headers };
  //   return this.http.put<IResUser>(`${url}user/actualizar`, body)
  // }

  listarUsuarios():Observable<IResUser>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResUser>(`${url}usuario/listar`, options);
  }

  verUsuario(id:number):Observable<IResUser>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResUser>(`${url}usuario/ver?id=${id}`,options);
  }

  crearUsuario(body: any):Observable<IResUser>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.post<IResUser>(`${url}usuario/crear`,body,options)
  }

  buscarUsuarios(filtro:any):Observable<IResUser>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResUser>(`${url}usuario/buscar?filtro=${filtro}`, options);
  }

  actualizarUsuario(body: any):Observable<IResUser>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.put<IResUser>(`${url}usuario/actualizar`, body, options)
  }

  eliminarUsuario(id: number):Observable<IResUser>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.delete<IResUser>(`${url}usuario/eliminar?id=${id}`)
  }
}
