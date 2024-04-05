import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Category, IResCategory } from '../interface/icategory';
import { Observable } from 'rxjs';
import { url } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) { }

  listarCategorias():Observable<IResCategory>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResCategory>(`${url}categoria/listar`, options);
  }

  verCategoria(id:number):Observable<IResCategory>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResCategory>(`${url}categoria/ver?id=${id}`,options);
  }

  crearCategoria(body: Category):Observable<IResCategory>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.post<IResCategory>(`${url}categoria/crear`,body,options)
  }

  buscarCategorias(filtro:any):Observable<IResCategory>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResCategory>(`${url}categoria/buscar?filtro=${filtro}`, options);
  }

  actualizarCategoria(body: any):Observable<IResCategory>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.put<IResCategory>(`${url}categoria/actualizar`, body, options)
  }

  eliminarCategoria(id: number):Observable<IResCategory>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.delete<IResCategory>(`${url}categoria/eliminar?id=${id}`)
  }
}
