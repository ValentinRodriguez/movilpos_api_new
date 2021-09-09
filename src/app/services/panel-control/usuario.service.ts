import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

const URL = environment.url;
const URLclean = environment.urlClean;

@Injectable({
  providedIn: 'root'
})

export class UsuarioService implements OnDestroy {
  usuarioActualizado = new EventEmitter();
  usuarioGuardado = new EventEmitter();
  usuarioBorrado = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  
  
  private iss = {
    login: `${URL}/login`,
    signup: `${URL}/signup`,
  }  
  listSubscribers: any = [];
  
  
  constructor(private http: HttpClient) { }

  ngOnDestroy() {
    console.log('destruido');
    
    this.listSubscribers.forEach(a => {
      console.log(a);      
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
        if (resp['code'] === 200)  {          
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
        if (resp['code'] === 200)  {          
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
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getUsers() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/users`).subscribe((resp: any) => {
        console.log(resp);        
        if (resp['code'] === 200)  {          
          resolve(resp.data);  
        }
      }))
    })
  }

  getUser(id) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/users/${id}`).subscribe((resp: any) => {                     
        if (resp['code'] === 200)  {          
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
    let user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      user.bodegas_permisos = JSON.parse(localStorage.getItem('bodegas_permisos') || '{}');
      // user.empleado = JSON.parse(localStorage.getItem('empleado'));
      user.empresa = JSON.parse(localStorage.getItem('empresa'));
      user.sessionId = localStorage.getItem('sessionId');
      return user;      
    }else{
      return null;
    }
  }

  login(forma: any) {
    return new Promise(resolve => {
      this.listSubscribers.push(this.http.post(`${URL}/login`,forma).subscribe((resp: any) => {
        console.log(resp);        
        if (resp.code === 200)  {          
          resolve(resp.data);   
          // this.getMyOauthToken(data);         
        }       
      }))
    })    
  }
  
  getMyOauthToken(data) {        
    this.http.post(`${URLclean}/oauth/token`, data).subscribe((resp: any) => {
      console.log(resp);       
    })
  }

  logout(email) {
    return this.http.post(`${URL}/logout`, email);
  }

  register(data: any) {
    let foto = data.foto;
    const formData = new FormData();     
    
    for(let key in data){  
      switch (key) {
        case 'foto':
          formData.append('foto', foto, foto.name );
          break;
        default:
          formData.append(key, data[key])
          break;
      }      
    }
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${URL}/signup`, formData).subscribe((resp: any) => {                      
        if (resp['code'] === 200)  {  
          this.usuarioGuardado.emit( resp.data );        
          resolve(resp.data);  
        }
      }))
    })
  }

  actUsuario(id, data) {    
    let foto = data.foto;
    const formData = new FormData();
    
    for(let key in data){  
      switch (key) {
        case 'foto':
          if (typeof foto !== 'string') {   
            formData.append('foto', foto, foto.name );    
            formData.append('fotoLength', foto.length)          
          } else {
            formData.append('foto', foto);
          }
        break;
        
        default:
          formData.append(key, data[key])
        break;
      }
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/act/usuario/${id}`, formData).subscribe( (resp: any) => {                         
        if (resp['code'] === 200)  {  
          this.usuarioActualizado.emit( resp.data );                                     
          resolve(resp.data);
        }
      }))
    });    
  }

  eliminarUsuario(id) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.delete(`${URL}/users/${id}`).subscribe((resp: any) => {                    
        if (resp['code'] === 200)  {  
          this.usuarioBorrado.emit( resp.data );        
          resolve(resp.data);  
        }
      }))
    })
  }

  handleToken(data: any) {
    this.setDataLocalStorage(data);    
  }

  setDataLocalStorage(data) {
    localStorage.setItem('token', data.access_token.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('empleado', JSON.stringify(data.empleado));
    localStorage.setItem('bodegas_permisos', JSON.stringify(data.bodegas_permisos));
    localStorage.setItem('empresa', JSON.stringify(data.empresa));    
    localStorage.setItem('sessionId', data.sessionId);
  }

  refreshToken() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${URL}/refresh`, {}).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  { 
          resolve(resp.data);  
        }
      }))
    })
  }

  getTokenLocalStorage() {
    return localStorage.getItem('token');
  }

  removeTokenLocalStorage() {
    localStorage.removeItem('token');
  }

  validateToken() {
    const token = this.getTokenLocalStorage();    
    return token?.length === 0 ? false : true;
    // const token = this.getTokenLocalStorage();
    // if (token) {
    //   const payload = this.payload(token);
    //   if (payload) {
    //     return Object.values(this.iss).indexOf(payload.iss) === 0 ? true : false;
    //   }
    // }
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
