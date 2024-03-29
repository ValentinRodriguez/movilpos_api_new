import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

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
      this.listSubscribers.push(this.http.get(URL+'/busqueda/cgtransacciones', {params}).subscribe((resp: any) => {                       
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/cgtransacciones`).subscribe((resp: any) => {              
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  gastosXdepartamentos(gastos) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${URL}/gastos-dep/cgtransacciones`,gastos).subscribe((resp: any) => {                         
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  mayorGeneral(gastos) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${URL}/mayor-general/cgtransacciones`,gastos).subscribe((resp: any) => {                        
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  autoLlenado() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/autollenado/cgtransacciones`).subscribe((resp: any) => {                        
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/cgtransacciones/${id}`).subscribe((resp: any) => {                     
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearTransaccion(transaccion: any) {
    let data: any = {};

    for(let key in transaccion){  
      switch (key) {
        case 'tipo_doc':
          data[key] = transaccion[key].ref
          break;

        case 'moneda':
          data[key] = transaccion[key].id
          break; 

        default:
          data[key] = transaccion[key]
          break;
      }
    }     
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/cgtransacciones`, data).subscribe( (resp: any) => {  
        if (resp['ok'])  {                                      
          resolve(resp.data);    
          this.transaccionGuardada.emit(resp.data);       
        }
      }))
    });    
  }

  actualizarTransaccion(id:number, transaccion: any) {  
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/cgtransacciones/${id}`, transaccion).subscribe( (resp: any) => {                 
        if (resp['ok'])  {
          this.transaccionAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarTransaccion(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/cgtransacciones/${id}`).subscribe( (resp: any) => {                       
        if (resp['ok'])  {            
          this.transaccionBorrada.emit(id);    
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
