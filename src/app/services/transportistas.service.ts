import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TransportistasService {

  trasnportistaGuardado = new EventEmitter();
  trasnportistaBorrado = new EventEmitter();
  trasnportistaAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient) {}

  getDatos() {
    return new Promise( resolve => {      
      this.http.get(`${URL}/transportistas`).subscribe((resp: any) => {
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
      })
    })
  }

  getDato(id: any) {
    return new Promise( resolve => {
      this.http.get(`${URL}/transportistas/${id}`).subscribe((resp: any) => {        
         this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearTransportista(transportista: any) {
    const formData = new FormData(); 
    
    for(let key in transportista){  
      switch (key) {
        case 'cod_zona':
        case 'id_pais':
        case 'cod_provincia':
          formData.append(key, transportista[key].id)  
          break;
      
        default:
          formData.append(key, transportista[key])
          break;
      }
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/transportistas`, formData).subscribe( (resp: any) => {        
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {    
            this.trasnportistaGuardado.emit( resp.data );                                   
            resolve(resp.data);       
          }
      });
    });    
  }

  actualizarTransportista(id:number, transportista: any) {
    let formdata: any = {};
    for(let key in transportista){  
      switch (key) {
        // case 'cod_zona':
        case 'id_pais':
        case 'cod_provincia':
          formdata[key] = transportista[key].id    
          break;
      
        default:
          formdata[key] = transportista[key]
          break;
      }
    }
      
    return new Promise( resolve => {
      this.http.put(`${ URL }/transportistas/${id}`, formdata)
          .subscribe( (resp: any) => {                                      
             
             this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {
              this.trasnportistaAct.emit( resp.data );                            
              resolve(resp);            
            }
          });
    });
  }

  borrarTransportista(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/transportistas/${id}`)
          .subscribe( (resp: any) => {                             
             this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {            
              this.trasnportistaBorrado.emit(id);    
              resolve(resp);            
            }
          });
    });
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
