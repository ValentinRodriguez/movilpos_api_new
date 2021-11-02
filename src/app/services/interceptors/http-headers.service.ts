import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GlobalFunctionsService } from '../globales/global-functions.service';
import { UsuarioService } from '../panel-control/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class HttpHeadersService implements HttpInterceptor{
  usuario: any;
  token: string
  constructor(private usuarioService: UsuarioService,
              private globalFuntionServ: GlobalFunctionsService) {
                this.usuario = this.usuarioService.getUserLogged()?.usuario.uid;                
                this.token = this.usuarioService.getTokenLocalStorage()?.token;  
                // console.log(this.token);
                                       
              }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    this.globalFuntionServ.formSubmitted.emit(true);
        
    if (req.method.toLowerCase() === 'post' ||
        req.method.toLowerCase() === 'put' ||
        req.method.toLowerCase() === 'delete') {
      req =  req.clone({
        setHeaders: {
          'Accept': 'application/json',
          'enctype': 'multipart/form-data',
          'x-token': `${this.token}`,
        },
        setParams:{
          usuario: this.usuario
        },
        body: { ...req.body }
      })
    }

    if (req.method.toLowerCase() === 'get') {    
      req = req.clone({
        setHeaders: {
          'Accept':  'application/json',
          'enctype': 'multipart/form-data',
          'x-token': `${this.token}`,
        },
        setParams: {
          usuario: this.usuario
        }
      });
    }

    return next.handle(req).pipe(      
      tap(evt => {        
        if (evt instanceof HttpResponse) {
          this.globalFuntionServ.formSubmitted.emit(false);
        }
      })
    )
  }
}
