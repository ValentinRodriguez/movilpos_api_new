import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LocalService } from '../crypt/local.service';
import { Router } from '@angular/router';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  usuarioActualizado = new EventEmitter();
  usuarioGuardado = new EventEmitter();
  usuarioBorrado = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  

  constructor(private http: HttpClient,
              private router: Router,
              private localService: LocalService) { }

  busquedaEmail(parametro?: any) {       
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     

    params = params.append('email',parametro.email);

    return this.http.get(URL+'/busqueda/email', {params})
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
    return this.http.get(URL+'/busqueda/username', {params})
  }

  busquedaNumEmp(parametro?: any) {    
    let params = new HttpParams();   
    params = params.append('empleado',parametro);

    return this.http.get(URL+'/busqueda/numemp', {params})
  }

  getUsers() {
    return this.http.get(`${URL}/usuarios`)
  }

  getUser(id) {
    return this.http.get(`${URL}/usuarios/${id}`)
  }

  getPerfiles() {
    return this.http.get(`${URL}/perfiles`)
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
    return this.http.get(`${URL}/user`)
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
    
    return this.http.post(`${URL}/signup`, formData)
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

    return this.http.post(`${ URL }/act/usuario/${id}`, formData)   
  }

  eliminarUsuario(id) {
    return this.http.delete(`${URL}/usuarios/${id}`)
  }

  refreshToken() {
    return this.http.post(`${URL}/refresh`, {})
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
