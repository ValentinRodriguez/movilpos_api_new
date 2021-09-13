import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../panel-control/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(public usuarioServ: UsuarioService,
              public router: Router){}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean  {    
    if (this.usuarioServ.loggedIn()) {
      console.log('valido');      
      return true;
    } else {
      console.log('no valido');
      this.router.navigateByUrl('/login')      
      return false;
    }
  }
  
}
