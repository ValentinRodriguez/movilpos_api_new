import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../panel-control/usuario.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ModulosService {

  constructor(private http: HttpClient,
              private usuarioServ: UsuarioService) { }

  getModulos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/modulos`).subscribe( (resp:any) => {                            
          if (resp['code'] === 200)  {                           
            resolve(resp['data']);            
          }
          if (resp.data === false && resp.msj === 'double-login' ) {
            this.usuarioServ.logout(this.usuarioServ.getUserLogged().email)        
          }
      });
    });
  }

  autoLlenado() {
    return new Promise( resolve => {
      this.http.get(`${URL}/autollenado/permisos`).subscribe( (resp:any) => {                            
          
        
          if (resp['code'] === 200)  {                           
            resolve(resp['data']);            
          }
      });
    });
  }
}
