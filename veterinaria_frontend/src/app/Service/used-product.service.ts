import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsedProductService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) { }

  // listarProductos():Observable<IREs>{
  //   const token = this.cookieService.get('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   const options = { headers: headers };
  //   return this.http.get<IResProduct>(`${url}producto/listar`, options);
  // }

  // verProducto(id:number):Observable<IResProduct>{
  //   const token = this.cookieService.get('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   const options = { headers: headers };
  //   return this.http.get<IResProduct>(`${url}producto/ver?id=${id}`,options);
  // }

  // crearProducto(body: Product):Observable<IResProduct>{
  //   const token = this.cookieService.get('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   const options = { headers: headers };
  //   return this.http.post<IResProduct>(`${url}producto/crear`,body,options)
  // }

  // buscarProductos(filtro:any):Observable<IResProduct>{
  //   const token = this.cookieService.get('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   const options = { headers: headers };
  //   return this.http.get<IResProduct>(`${url}producto/buscar?filtro=${filtro}`, options);
  // }

  // actualizarProducto(body: any):Observable<IResProduct>{
  //   const token = this.cookieService.get('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   const options = { headers: headers };
  //   return this.http.put<IResProduct>(`${url}producto/actualizar`, body, options)
  // }

  // eliminarProducto(id: number):Observable<IResProduct>{
  //   const token = this.cookieService.get('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   const options = { headers: headers };
  //   return this.http.delete<IResProduct>(`${url}producto/eliminar?id=${id}`)
  // }
}
