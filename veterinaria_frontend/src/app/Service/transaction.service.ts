import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { IResTransaction, Transaction } from '../interface/itransaction';
import { Observable } from 'rxjs';
import { url } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) { }

  listarTransacciones():Observable<IResTransaction>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResTransaction>(`${url}transaccion/listar`, options);
  }

  verTransaccion(id:number):Observable<IResTransaction>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResTransaction>(`${url}transaccion/ver?id=${id}`,options);
  }

  crearTransaccion(body: Transaction):Observable<IResTransaction>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.post<IResTransaction>(`${url}transaccion/crear`,body,options)
  }

  buscarTransacciones(filtro:any):Observable<IResTransaction>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResTransaction>(`${url}transaccion/buscar?filtro=${filtro}`, options);
  }

  actualizarTransaccion(body: any):Observable<IResTransaction>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.put<IResTransaction>(`${url}transaccion/actualizar`, body, options)
  }

  eliminarTransaccion(id: number):Observable<IResTransaction>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.delete<IResTransaction>(`${url}transaccion/eliminar?id=${id}`, options)
  }

  listarPorCliente(id:number):Observable<IResTransaction>{
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.get<IResTransaction>(`${url}transaccion/lista_clientes?id=${id}`,options);
  }
}
