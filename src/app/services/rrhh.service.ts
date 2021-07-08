import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RrhhService {

  empleadoEscogido = new EventEmitter();
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient) {}

  getDatos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/noempleados`).subscribe((resp: any) => {
        this.formSubmitted.emit(false);
        if (resp['code'] === 200)  {        
          resolve(resp.data);            
        }
      })
    })
  }

  
  getCajeros() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/cajeros`).subscribe((resp: any) => {
        console.log(resp);        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getBancos() {
    return new Promise( resolve => {
        this.http.get(`${URL}/bancos`).subscribe((resp: any) => {                        
        if (resp['code'] === 200)  {        
          resolve(resp.data);            
        }
      })
    })
  }

  autoLlenado() {
    return new Promise( resolve => {
        this.http.get(`${URL}/autollenado/empleados`).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  {        
          resolve(resp.data);            
        }
      })
    })
  }

  buscaVendedores() {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/vendedores`).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  { 
          resolve(resp.data);            
        }
      })
    })
  }

  buscaSupervisores(id:string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/supervisores/${id}`).subscribe((resp: any) => {                            
        if (resp['code'] === 200)  { 
          resolve(resp.data);            
        }
      })
    })
  }

  crearEmpleado(empresa) {
    const formData = new FormData();
    
    for(let key in empresa){        
      formData.append(key, empresa[key])
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/noempleados`, formData).subscribe( (resp:any) => {
        this.formSubmitted.emit(false);                           
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);      
        }
      });
    });    
  }

  empleadoEscogidos(empleado) {
    this.empleadoEscogido.emit(empleado);
  }

}
