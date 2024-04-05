import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Bill, IResBill } from '../interface/ibill';
import { Observable } from 'rxjs';
import { url } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) { }

  listarFacturas():Observable<IResBill>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResBill>(`${url}factura/listar`, options);
  }

  verFactura(id:number):Observable<IResBill>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResBill>(`${url}factura/ver?id=${id}`,options);
  }

  crearFactura(body: Bill):Observable<IResBill>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.post<IResBill>(`${url}factura/crear`,body,options)
  }

  buscarFacturas(filtro:any):Observable<IResBill>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResBill>(`${url}factura/buscar?filtro=${filtro}`, options);
  }

  actualizarFactura(body: any):Observable<IResBill>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.put<IResBill>(`${url}factura/actualizar`, body, options)
  }

  eliminarFactura(id: number):Observable<IResBill>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.delete<IResBill>(`${url}factura/eliminar?id=${id}`)
  }
}
