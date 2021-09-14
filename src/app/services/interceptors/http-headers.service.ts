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
  user: any;
  
  constructor(private usuarioService: UsuarioService,
              private globalFuntionServ: GlobalFunctionsService,
              private router: Router) {
                this.user = this.usuarioService.getUserLogged();
                console.log(this.user);    
              }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    this.globalFuntionServ.formSubmitted.emit(true);
    
    const sessionId = localStorage.getItem('sessionId');
    const usuario_creador = `${this.user.username}`;
    const token = this.usuarioService.getTokenLocalStorage()?.access_token;
    const empresa = this.usuarioService.getEmpresa().id;

    if (req.method.toLowerCase() === 'post' ||
        req.method.toLowerCase() === 'put' ||
        req.method.toLowerCase() === 'delete') {
      req =  req.clone({
        setHeaders: {
          'Accept': 'application/json',
          'enctype'      : 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        setParams:{
          sessionId: sessionId,
          usuario_creador: usuario_creador,
          urlRequest: this.router.url,
          empresa: empresa
        },
        body: req.body instanceof FormData ? req.body.append('sessionId', sessionId)
                                           : { ...req.body, sessionId, usuario_creador,empresa }
      })
    }

    if (req.method.toLowerCase() === 'get') {    
      req = req.clone({
        setHeaders: {
          'Accept': 'application/json',
          'enctype'      : 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        setParams: {
          sessionId: sessionId,
          urlRequest: this.router.url,
          usuario_creador: usuario_creador,
          empresa: empresa
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
