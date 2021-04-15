import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  actividadGuardada = new EventEmitter();
  actividadBorrada = new EventEmitter();
  actividadActualizada = new EventEmitter();
  formSubmitted = new EventEmitter();

  constructor(private http: HttpClient) { 
              }

  busquedaActividad(parametro?: any) {
    let params = new HttpParams();      
    params = params.append('actividad',parametro);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/actividades', {params}).subscribe((resp: any) => { 
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDatos() {
    return new Promise( resolve => {
      return this.http.get(`${URL}/actividades`).subscribe((resp: any) => {
         this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id) {
    return new Promise( resolve => {
      return this.http.get(`${URL}/actividades/${id}`).subscribe((resp: any) => {
         this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearActividad(actividad: any) {
    
    // if (actividad.url === undefined  || actividad.url === '') {
    //   actividad.url === null;
    // }
    return new Promise( resolve => {
      this.http.post(`${ URL }/actividades`, actividad)
          .subscribe( (resp:any) => {
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {                                      
            resolve(resp.data);    
            this.actividadGuardada.emit( resp.data );       
          }
      });
    });    
  }

  actualizarActividad(actividad: any) {        
    return new Promise( resolve => {
      this.http.put(`${ URL }/actividades/${actividad.id}`, actividad)
              .subscribe( (resp: any) => { 
                 
                
                 this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {                  
                  this.actividadActualizada.emit( resp.data );                            
                  resolve(resp.data);            
                } else {
                  resolve(false);
                }
              });
    });
  }

  borrarActividad(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/actividades/${id}`)
          .subscribe( (resp: any) => {   
             
                                      
             this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {            
              this.actividadBorrada.emit(id);    
              resolve(resp.data);            
            } else {
              resolve(false);
            }
          });
    });
  }
}
