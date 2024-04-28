import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ConfirmInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.method === 'DELETE' || request.method === 'PATCH' || request.method === 'PUT') {
      return new Observable<HttpEvent<any>>(observer => {
        Swal.fire({
          title: 'Confirmar acción',
          text: '¿Estás seguro de realizar esta acción?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            // Continuar con la solicitud si se confirma
            next.handle(request).subscribe((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                observer.next(event); // Emitir la respuesta HTTP
              }
            }, (error) => {
              observer.error(error); // Emitir el error
            }, () => {
              observer.complete(); // Completar el observable
            });
          } else {
            observer.complete(); // Cancelar la solicitud si se cancela en el modal
          }
        });
      });
    } else {
      // Continuar con la solicitud si no es DELETE, PATCH o PUT
      return next.handle(request);
    }
  }
}
