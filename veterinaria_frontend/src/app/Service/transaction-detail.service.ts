import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IResTransacDetail, TransacDetail } from '../interface/itransaction-detail';
import { url } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class TransactionDetailService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) { }

  listarDetalles():Observable<IResTransacDetail>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResTransacDetail>(`${url}detalle/listar`, options);
  }

  verDetalle(id:number):Observable<IResTransacDetail>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResTransacDetail>(`${url}detalle/ver?id=${id}`,options);
  }

  crearDetalle(body: TransacDetail):Observable<IResTransacDetail>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.post<IResTransacDetail>(`${url}detalle/crear`,body,options)
  }

  buscarDetalles(filtro:any):Observable<IResTransacDetail>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResTransacDetail>(`${url}detalle/buscar?filtro=${filtro}`, options);
  }

  actualizarDetalle(body: any):Observable<IResTransacDetail>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.put<IResTransacDetail>(`${url}detalle/actualizar`, body, options)
  }

  eliminarDetalle(id: number):Observable<IResTransacDetail>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.delete<IResTransacDetail>(`${url}detalle/eliminar?id=${id}`)
  }
}
