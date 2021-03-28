import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PeriodosFiscalesService {

  periodoGuardado = new EventEmitter();
  periodoBorrado = new EventEmitter();
  periodoActualizado = new EventEmitter();
  guardar = new EventEmitter();
  usuario: any;

  constructor(private http: HttpClient) { }

  busquedaPeriodo(parametro?: any) {
    let params = new HttpParams();      
    params = params.append('periodos',parametro);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/periodos-fiscales', {params}).subscribe((resp: any) => { 
              
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDatos() {
    return new Promise( resolve => {
      return this.http.get(`${URL}/periodos-fiscales`).subscribe((resp: any) => {             
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id) {
    return new Promise( resolve => {
      return this.http.get(`${URL}/periodos-fiscales/${id}`).subscribe((resp: any) => {
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearPeriodo(periodo: any) {    
    return new Promise( resolve => {
      this.http.post(`${ URL }/periodos-fiscales`, periodo)
          .subscribe( (resp:any) => {
                       
          if (resp['code'] === 200) {                                      
            resolve(resp);    
            this.periodoGuardado.emit( resp.data );       
          }
      });
    });    
  }

  actualizarPeriodo(id:string, periodo: any) {        
    return new Promise( resolve => {
      this.http.put(`${ URL }/periodos-fiscales/${id}`, periodo)
              .subscribe( (resp: any) => { 
                                 
                if (resp['code'] === 200) {                  
                  this.periodoActualizado.emit( resp.data );                            
                  resolve(resp);            
                }
              });
    });
  }

  borrarPeriodo(id: string) {    
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/periodos-fiscales/${id}`)
          .subscribe( (resp: any) => {  
                                                    
            if (resp['code'] === 200) {            
              this.periodoBorrado.emit(id);    
              resolve(resp);            
            }
          });
    });
  }

  restaurarPeriodo(id: string) {
    const periodo = {"periodo": id}
    return new Promise( resolve => {      
      this.http.post(`${ URL }/restaurar/periodo-fiscal`,periodo)
          .subscribe( (resp: any) => {  
                                                    
            if (resp['code'] === 200) {            
              this.periodoBorrado.emit(id);    
              resolve(resp);            
            }
          });
    });
  }
}
