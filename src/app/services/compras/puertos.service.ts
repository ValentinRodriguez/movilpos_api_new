import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class PuertosService {

  puertoGuardada = new EventEmitter();
  puertoBorrada = new EventEmitter();
  puertoActualizada = new EventEmitter();
  actualizar = new EventEmitter();
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

  busquedaPuerto(parametro?: any) {
    let params = new HttpParams();      
    params = params.append('puerto',parametro);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/puerto', {params}).subscribe((resp: any) => { 
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/puertos`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/puertos/${id}`).subscribe((resp: any) => {                     
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearPuerto(bodega: any) {
    const formData = new FormData();
    
    for(let key in bodega){  
      formData.append(key, bodega[key])
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/puertos`, formData).subscribe( (resp:any) => {      
        if (resp['ok'])  {                                      
          resolve(resp.data);    
          this.puertoGuardada.emit( resp.data );       
        }
      }))
    });    
  }

  actualizarPuerto(id:number, puerto: any) {        
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/puertos/${id}`, puerto).subscribe( (resp: any) => {
        if (resp['ok'])  {                  
          this.puertoActualizada.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarPuerto(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/puertos/${id}`).subscribe( (resp: any) => {                                                                  
        if (resp['ok'])  {            
          this.puertoBorrada.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
