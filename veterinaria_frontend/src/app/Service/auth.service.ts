import { Injectable } from '@angular/core';
import { IResUser, User } from '../interface/iuser'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { url } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) { }

  login(form: any): Observable<IResUser> {
    let direccion = `${url}auth/login`
    return this.http.post<IResUser>(direccion, form);
  }

  logout(): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.http.post<any>(`${url}auth/logout`, {}, options);
  }

  isAuthenticated(): boolean {
    const token = this.cookieService.get('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

}
