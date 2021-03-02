import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor{

  constructor(private service: MessageService,
              private router: Router,) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle( req ) .pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {        
        if (error instanceof HttpErrorResponse) {
          // console.log('OBJETO ERROR',error.status);
          // console.log('MENSAJE ERROR:',error.error.message);
          // console.log('ERRORES:',error.error.errors);
          // console.log('DATA:',error.error.data);
          this.mensajeError(error)         
          return throwError(error);
        }else{
          console.log('client side');          
          return throwError(error);
        }
      })
    )
  }

  mensajeError( error: HttpErrorResponse  ) {
    switch (error.status) {
      case 500:
        this.service.add({ key: 'tst', severity: 'error', summary: 'Error interno del servidor', detail: error.error.message });        
        break;

      case 501:
        if(error.error.data === '501x') {
          this.router.navigateByUrl('/login');
        }else {
          this.service.add({ key: 'tst', severity: 'error', summary: 'Error en consulta', detail: error.error.data });
        }
        break;

      case 502:
        this.service.add({ key: 'tst', severity: 'error', summary: error.error.msj, detail: error.error.data });        
        break;

      case 422:
        this.service.add({ key: 'tst', severity: 'error', summary: 'La información suministrada es invalida', detail: error.error.errors });        
        break;

      case 405:
        this.service.add({ key: 'tst', severity: 'error', summary: 'Error interno del servidor', detail: error.error.message });        
        break;
        
      case 404:
        this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Dirección de solicitud no encontrada'});        
        break;

      // case 401:
      //   this.router.navigateByUrl('/login');     
      //   break;

      default:
        break;
    }
  }
}
