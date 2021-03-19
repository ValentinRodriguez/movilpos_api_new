import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TransacionPagosService {

  transaccionGuardada = new EventEmitter();
  transaccionBorrada = new EventEmitter();
  transaccionAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();

  constructor(private http: HttpClient) { }

  busquedaTransaccion(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('transacciones',parametro.transacciones);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/cgtransacciones', {params}).subscribe((resp: any) => {  
          console.log(resp);          
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/cgtransacciones`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  autoLlenado() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/autollenado/cgtransacciones`).subscribe((resp: any) => {
          console.log(resp);
        
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/cgtransacciones/${id}`).subscribe((resp: any) => {
          console.log(resp);
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  crearTransaccion(transaccion: any) {
    let data: any = {};

    for(let key in transaccion){  
      switch (key) {
        case 'tipo_doc':
        case 'moneda':
          data[key] = transaccion[key].id
          break; 

        default:
          data[key] = transaccion[key]
          break;
      }
    }
    console.log(data);
    
    return new Promise( resolve => {
      this.http.post(`${ URL }/cgtransacciones`, data).subscribe( (resp: any) => {
          console.log(resp);
          
          if (resp['code'] === 200) {                                      
            resolve(resp);    
            this.transaccionGuardada.emit(resp.data);       
          }
      });
    });    
  }

  actualizarTransaccion(id:number, transaccion: any) {  
    return new Promise( resolve => {
      this.http.put(`${ URL }/cgtransacciones/${id}`, transaccion)
          .subscribe( (resp: any) => {                
            console.log(resp);
            
            if (resp['code'] === 200) {
              this.transaccionAct.emit( resp.data );                            
              resolve(resp);            
            }
          });
    });
  }

  borrarTransaccion(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/cgtransacciones/${id}`)
          .subscribe( (resp: any) => {
            if (resp['code'] === 200) {            
              this.transaccionBorrada.emit(id);    
              resolve(resp);            
            } else {
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
