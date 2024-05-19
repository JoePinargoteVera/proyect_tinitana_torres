import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { IResProvider, Provider } from '../interface/iprovider';
import { Observable } from 'rxjs';
import { url } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) { }

  listarProveedores():Observable<IResProvider>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResProvider>(`${url}proveedor/listar`, options);
  } //listar_productos

  listarProductos(id:number):Observable<IResProvider>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResProvider>(`${url}proveedor/listar_productos?id=${id}`, options);
  }

  verProveedor(id:number):Observable<IResProvider>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResProvider>(`${url}proveedor/ver?id=${id}`,options);
  }

  crearProveedor(body: Provider):Observable<IResProvider>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.post<IResProvider>(`${url}proveedor/crear`,body,options)
  }

  buscarProveedores(filtro:any):Observable<IResProvider>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResProvider>(`${url}proveedor/buscar?filtro=${filtro}`, options);
  }

  actualizarProveedor(body: any):Observable<IResProvider>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.put<IResProvider>(`${url}proveedor/actualizar`, body, options)
  }

  eliminarProveedor(id: number):Observable<IResProvider>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.delete<IResProvider>(`${url}proveedor/eliminar?id=${id}`)
  }
}
