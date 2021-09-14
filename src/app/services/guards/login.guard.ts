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
    console.log(this.usuarioServ.loggedIn());    
    if (this.usuarioServ.loggedIn()) {  
      this.router.navigateByUrl('/login')      
      return false;
    } else {
      return true;
    }
  }
  
}
