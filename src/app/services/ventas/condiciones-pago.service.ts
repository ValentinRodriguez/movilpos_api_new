import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams, } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class CondicionesPagoService {

  condicionGuardada = new EventEmitter();
  condicionBorrada = new EventEmitter();
  condicionAct = new EventEmitter();
  
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

  busquedacondicion(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('condicion',parametro.condicion);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/condiciones-pago', {params}).subscribe((resp: any) => {   
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/condiciones-pago`).subscribe((resp: any) => {                                      
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/condiciones-pago/${id}`).subscribe((resp: any) => {      
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearCondicion(condicion: any) {
    const formData = new FormData();    

    for(let key in condicion){  
      formData.append(key, condicion[key]);
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/condiciones-pago`, formData).subscribe( (resp: any) => {
                                   
        if (resp['ok'])  {                                      
          resolve(resp.data);    
          this.condicionGuardada.emit(resp.data);       
        }
      }))
    });    
  }

  actualizarCondicion(id:string, condicion: any) {  
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/condiciones-pago/${id}`, condicion).subscribe( (resp: any) => { 
        if (resp['ok'])  {
          this.condicionAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarCondicion(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/condiciones-pago/${id}`).subscribe( (resp: any) => {
        if (resp['ok'])  {            
          this.condicionBorrada.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }
}
