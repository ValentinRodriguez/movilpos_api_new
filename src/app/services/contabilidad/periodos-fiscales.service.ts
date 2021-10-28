import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
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

  listSubscribers: any = [];
  
  constructor(private http: HttpClient) { }

  ngOnDestroy() {
    console.log('destruido');    
    this.listSubscribers.forEach(a => {
      if (a !== undefined) {
        a.unsubscribe()        
      }
    });
  }

  busquedaPeriodo(parametro?: any) {
    let params = new HttpParams();      
    params = params.append('periodos',parametro);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/periodos-fiscales', {params}).subscribe((resp: any) => {                     
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/periodos-fiscales`).subscribe((resp: any) => {                       
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/periodos-fiscales/${id}`).subscribe((resp: any) => {                        
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearPeriodo(periodo: any) {    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/periodos-fiscales`, periodo).subscribe( (resp:any) => {
        if (resp['ok'])  {                                      
          resolve(resp.data);    
          this.periodoGuardado.emit( resp.data );       
        }
      }))
    });    
  }

  actualizarPeriodo(id:string, periodo: any) {        
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/periodos-fiscales/${id}`, periodo).subscribe( (resp: any) => {
        if (resp['ok'])  {                  
          this.periodoActualizado.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarPeriodo(id: string) {    
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/periodos-fiscales/${id}`).subscribe( (resp: any) => {                                 
        if (resp['ok'])  {            
          this.periodoBorrado.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }

  restaurarPeriodo(id: string) {
    const periodo = {"periodo": id}
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.post(`${ URL }/restaurar/periodo-fiscal`,periodo).subscribe( (resp: any) => {                         
        if (resp['ok'])  {            
          this.periodoBorrado.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }
}
