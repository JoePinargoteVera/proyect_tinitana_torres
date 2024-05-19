import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { url } from '../app.module';
import { Observable } from 'rxjs';
import { IResProduct, Product } from '../interface/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) { }


  listarProductos():Observable<IResProduct>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResProduct>(`${url}producto/listar`, options);
  }

  verProducto(id:number):Observable<IResProduct>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResProduct>(`${url}producto/ver?id=${id}`,options);
  }

  crearProducto(body: Product):Observable<IResProduct>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.post<IResProduct>(`${url}producto/crear`,body,options)
  }

  buscarProductos(filtro:any):Observable<IResProduct>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResProduct>(`${url}producto/buscar?filtro=${filtro}`, options);
  }

  actualizarProducto(body: any):Observable<IResProduct>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.patch<IResProduct>(`${url}producto/actualizar`, body, options)
  }

  eliminarProducto(id: number | undefined):Observable<IResProduct>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.put<IResProduct>(`${url}producto/eliminar`,{'id':id},options)
  }

  incrementar(id:number, cantidad:number):Observable<IResProduct>{
    const body = {id: id, cantidad:cantidad}
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.put<IResProduct>(`${url}producto/incrementar`, body, options)
  }

  decrementar(id:number, cantidad:number):Observable<IResProduct>{
    const body = {id: id, cantidad:cantidad}
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.put<IResProduct>(`${url}producto/decrementar`, body, options)
  }

}
