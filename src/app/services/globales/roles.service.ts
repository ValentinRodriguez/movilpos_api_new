import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../panel-control/usuario.service';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  
  permisos = new EventEmitter();

  constructor(private http: HttpClient,
              private usuarioServ: UsuarioService) { }

  getRoles() {
    return new Promise( resolve => {
      this.http.get(`${URL}/roles`).subscribe((resp: any) => {                    
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getRol(email: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/roles/${email}`).subscribe((resp: any) => {                                
        if (resp['code'] === 200)  {  
          this.permisos.emit(resp.data);       
          resolve(resp.data);            
        }
      })
    })
  }

  getRolFull(email: string, usuario: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/roles/usuario/${usuario}/${email}`).subscribe((resp: any) => {  
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  guardarRoles(rol: any, email: string, usuario: string) {
    const formData = new FormData();
    for(let key in rol){ 
      formData.append(key, JSON.stringify(rol[key]))
    }

    formData.append('email', email);
    formData.append('usuario', usuario);
    formData.append('estado', 'activo');
    formData.append('usuario_creador', this.usuarioServ.getUserLogged().username);
    
    return new Promise( resolve => {
      this.http.post(`${URL}/roles`, formData).subscribe((resp: any) => {
                              
        if (resp['code'] === 200)  {          
          resolve(resp.data);  
        }
      })
    })
  }

  eliminarRoles(email) {
    return new Promise( resolve => {
      this.http.delete(`${URL}/roles/${email}`).subscribe((resp: any) => {  
        if (resp['code'] === 200)  {        
          resolve(resp.data);  
        }
      })
    })
  }
}
