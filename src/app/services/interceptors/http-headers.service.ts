import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GlobalFunctionsService } from '../globales/global-functions.service';
import { UsuarioService } from '../panel-control/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class HttpHeadersService implements HttpInterceptor{
  
  constructor(private usuarioService: UsuarioService,
              private globalFuntionServ: GlobalFunctionsService,
              private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.globalFuntionServ.formSubmitted.emit(true);
    
    if (req.method.toLowerCase() === 'post' || req.method.toLowerCase() === 'put' || req.method.toLowerCase() === 'delete') {     
      if (req.body instanceof FormData) {
        req =  req.clone({
          setHeaders: {
            'enctype'      : 'multipart/form-data',
            'Authorization': `Bearer ${this.usuarioService.getTokenLocalStorage()}`,
          },
          setParams:{
            sessionId: localStorage.getItem('sessionId'),
            usuario_creador: `${this.usuarioService.getUserLogged().username}` || 'movilsoluciones',
            urlRequest: this.router.url
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
          setParams: {
            sessionId: localStorage.getItem('sessionId'),
            urlRequest: this.router.url
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
        }  
      });
    }

    return next.handle(req).pipe(      
      tap(evt => {        
        if (evt instanceof HttpResponse) {
          this.globalFuntionServ.formReceived.emit(false);      
        }
    })
    )
  }
}
