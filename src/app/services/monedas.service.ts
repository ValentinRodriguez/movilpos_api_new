import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class MonedasService {

  monedaGuardada = new EventEmitter();
  monedaBorrada = new EventEmitter();
  monedaAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  busquedaMoneda(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('monedas',parametro.monedas);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/monedas', {params}).subscribe((resp: any) => { 
          this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/monedas`).subscribe((resp: any) => {
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/monedas/${id}`).subscribe((resp: any) => {           
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }

  crearMoneda(moneda: any) {
    const formData = new FormData();  
    for(let key in moneda){  
      formData.append(key, moneda[key]);
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/monedas`, formData).subscribe( (resp: any) => {
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {                                      
            resolve(resp);    
            this.monedaGuardada.emit(resp.data);       
          }
      });
    });    
  }

  actualizarMoneda(id:number, moneda: any) {  
    return new Promise( resolve => {
      this.http.put(`${ URL }/monedas/${id}`, moneda).subscribe( (resp: any) => {                
            this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {
              this.monedaAct.emit( resp.data );                            
              resolve(resp);            
            }
          });
    });
  }

  borrarMoneda(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/monedas/${id}`).subscribe( (resp: any) => {
          this.formSubmitted.emit(false);                           
          if (resp['code'] === 200)  {            
            this.monedaBorrada.emit(id);    
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

