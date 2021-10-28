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

  listSubscribers: any = [];
  
  ngOnDestroy() {
  }

  getModulos() {
    return this.http.get(`${URL}/modulos`);
  }

  autoLlenado() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/autollenado/permisos`).subscribe( (resp:any) => {
        if (resp['ok'])  {                           
          resolve(resp['data']);            
        }
      }))
    });
  }
}
