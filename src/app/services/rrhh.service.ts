import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RrhhService {

  empleadoEscogido = new EventEmitter();
  constructor(private http: HttpClient) {}

  getDatos() {
    return new Promise( resolve => {
        this.http.get(`${URL}/noempleados`).subscribe((resp: any) => {
          console.log(resp);
          
          if (resp['code'] === 200) {        
            resolve(resp.data);            
          }
      })
    })
  }

  autoLlenado() {
    return new Promise( resolve => {
        this.http.get(`${URL}/autollenado/empleados`).subscribe((resp: any) => {
          if (resp['code'] === 200) {        
            resolve(resp.data);            
          }
      })
    })
  }

  buscaVendedores() {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/vendedores`).subscribe((resp: any) => {        
        if (resp['code'] === 200) { 
          resolve(resp.data);            
        }
      })
    })
  }

  buscaSupervisores(id:string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/supervisores/${id}`).subscribe((resp: any) => {  
        console.log(resp);              
        if (resp['code'] === 200) { 
          resolve(resp.data);            
        }
      })
    })
  }

  crearEmpleado(empresa) {
    const formData = new FormData();
    console.log(empresa);
    
    for(let key in empresa){        
      formData.append(key, empresa[key])
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/empresa`, formData)
               .subscribe( resp => {
               if (resp['code'] === 200) {                                      
                 resolve(resp);      
               }
      });
    });    
  }

  empleadoEscogidos(empleado) {
    this.empleadoEscogido.emit(empleado);
  }

}
