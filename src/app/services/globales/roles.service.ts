import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../panel-control/usuario.service';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  
  listSubscribers: any = [];
  permisos = new EventEmitter();

  constructor(private http: HttpClient,
              private usuarioServ: UsuarioService) { }  
            
  ngOnDestroy() {
    console.log('destruido');    
    this.listSubscribers.forEach(a => {
      if (a !== undefined) {
        a.unsubscribe()        
      }
    });
  }

  getRoles() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/roles`).subscribe((resp: any) => {                
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getRol(email: string) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/roles/${email}`).subscribe((resp: any) => {                                
        if (resp['ok'])  {                   
          resolve(resp.data);            
        }
      }))
    })
  }

  getRolFull(email: string, usuario: string) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/roles/usuario/${usuario}/${email}`).subscribe((resp: any) => {  
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
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
    formData.append('usuario', this.usuarioServ.getUserLogged().username);
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${URL}/roles`, formData).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);  
        }
      }))
    })
  }

  eliminarRoles(email) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.delete(`${URL}/roles/${email}`).subscribe((resp: any) => {  
        if (resp['ok'])  {        
          resolve(resp.data);  
        }
      }))
    })
  }
}
