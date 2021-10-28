import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LocalService } from '../crypt/local.service';
import { Router } from '@angular/router';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})

export class UsuarioService implements OnDestroy {
  usuarioActualizado = new EventEmitter();
  usuarioGuardado = new EventEmitter();
  usuarioBorrado = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  
  listSubscribers: any = []; 

  constructor(private http: HttpClient,
              private router: Router,
              private localService: LocalService) { }

  ngOnDestroy() {  
    this.listSubscribers.forEach(a => {
      if (a !== undefined) {
        a.unsubscribe()        
      }
    });
  }

  busquedaEmail(parametro?: any) {       
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     

    params = params.append('email',parametro.email);

    return new Promise(resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/email', {params}).subscribe((resp: any) => {                      
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  busquedaUsername(parametro?: any) {    
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('username',parametro.username);   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/username', {params}).subscribe((resp: any) => {  
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  busquedaNumEmp(parametro?: any) {    
    let params = new HttpParams();   
    params = params.append('empleado',parametro);

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/numemp', {params}).subscribe((resp: any) => {   
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getUsers() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/users`).subscribe((resp: any) => {     
        if (resp['ok'])  {          
          resolve(resp.data);  
        }
      }))
    })
  }

  getUser(id) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/users/${id}`).subscribe((resp: any) => {                     
        if (resp['ok'])  {          
          resolve(resp.data);  
        }
      }))
    })
  }

  getPerfiles() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/perfiles`).subscribe((resp: any) => {                      
        if (resp['access_token'] === 200)  {          
          resolve(resp.data);  
        }
      }))
    })
  }

  getUserLogged() {    
    let user = this.getLocalStorage('localStorage');
    return user;
  }

  getEmpresa() {
    let empresa = this.getLocalStorage('localStorage');
    return empresa;
  }

  whoIslogged() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/user`).subscribe((resp: any) => {                      
        resolve(resp.data);
      }))
    })
  }
  
  login(forma: any) {
    return this.http.post(`${URL}/auth/login`, forma)
  }
 
  setLocalStorage(data) {
    this.localService.setJsonValue('localStorage', data);
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key)
  }

  clearLocalStorage() {
    return this.localService.clearToken();
  }

  logout(email) {
    return this.http.post(`${URL}/logout`, email).subscribe((resp: any) => {
      if (resp['ok'])  {  
          localStorage.removeItem('modulos');
          localStorage.removeItem('perfiles');
          localStorage.removeItem('roles');
          localStorage.removeItem('menues');
          localStorage.removeItem('permisos');
          localStorage.removeItem('bodegas_permisos');
          localStorage.removeItem('empresa');
          this.clearLocalStorage();
          this.router.navigate(['/login']);  
      }
  })
  }

  register(data: any) {
    let img = data.img;
    const formData = new FormData();     
    
    for(let key in data){  
      switch (key) {
        case 'img':
          formData.append('img', img, img.name );
          break;
        default:
          formData.append(key, data[key])
          break;
      }      
    }
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${URL}/signup`, formData).subscribe((resp: any) => {                      
        if (resp['ok'])  {  
          this.usuarioGuardado.emit( resp.data );        
          resolve(resp.data);  
        }
      }))
    })
  }

  actUsuario(id, data) {    
    let img = data.img;
    const formData = new FormData();
    
    for(let key in data){  
      switch (key) {
        case 'img':
          if (typeof img !== 'string') {   
            formData.append('img', img, img.name );    
            formData.append('imgLength', img.length)          
          } else {
            formData.append('img', img);
          }
        break;
        
        default:
          formData.append(key, data[key])
        break;
      }
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/act/usuario/${id}`, formData).subscribe( (resp: any) => {                         
        if (resp['ok'])  {  
          this.usuarioActualizado.emit( resp.data );                                     
          resolve(resp.data);
        }
      }))
    });    
  }

  eliminarUsuario(id) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.delete(`${URL}/users/${id}`).subscribe((resp: any) => {                    
        if (resp['ok'])  {  
          this.usuarioBorrado.emit( resp.data );        
          resolve(resp.data);  
        }
      }))
    })
  }

  refreshToken() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${URL}/refresh`, {}).subscribe((resp: any) => {                         
        if (resp['ok'])  { 
          resolve(resp.data);  
        }
      }))
    })
  }

  getTokenLocalStorage() {
    return this.getLocalStorage('localStorage');
  }

  validateToken() {
    const token = this.getTokenLocalStorage();  
    if (token !== null) {
      return false;      
    } else {
      return true
    }
  }

  payload(token) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload) {
    return JSON.parse(atob(payload));
  }

  loggedIn() {
    return this.validateToken()
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
