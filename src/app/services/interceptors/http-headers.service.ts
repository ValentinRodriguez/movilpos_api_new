import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HttpHeadersService implements HttpInterceptor{

  constructor(private usuarioService:UsuarioService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (req.method.toLowerCase() === 'post') {
      if (req.body instanceof FormData) {
        req =  req.clone({
          setHeaders: {
            'enctype'      : 'multipart/form-data',
            'Authorization': `Bearer ${this.usuarioService.getTokenLocalStorage()}`,
          },
          body: req.body.append('sessionId', localStorage.getItem('sessionId'))
        })
      } else {
        const foo = {}; 
        foo['sessionId'] = localStorage.getItem('sessionId');
        req =  req.clone({
          setHeaders: {
            'enctype'      : 'multipart/form-data',
            'Authorization': `Bearer ${this.usuarioService.getTokenLocalStorage()}`,
          },
          body: {...req.body, ...foo}
        })
      }
    }
    if (req.method.toLowerCase() === 'get') {
      req = req.clone({
        setHeaders: {
          'enctype'      : 'multipart/form-data',
          'Authorization': `Bearer ${this.usuarioService.getTokenLocalStorage()}`,
        },
        setParams:{
          sessionId: localStorage.getItem('sessionId'),
          usuario_creador: `${this.usuarioService.getTokenLocalStorage()}`
        }  
      });
    }
    // console.log('BODY:',req.body)
    return next.handle(req);
  }
}
