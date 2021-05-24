import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  transaccionGuardado = new EventEmitter();
  transaccionBorrada = new EventEmitter();
  formSubmitted = new EventEmitter();
  finalizar = new EventEmitter();

  constructor(private http: HttpClient ) { }

  getDatos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/invtransacciones`).subscribe((resp: any) => {                          
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  autoLlenado() {
    return new Promise( resolve => {
      this.http.get(`${URL}/autollenado/invtransacciones`).subscribe((resp: any) => {                        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearTransaccion(transaccion: any) {
    let data = {}
    console.log(transaccion);
    
    for(let key in transaccion){  
      switch (key) {
        case 'id_bodega':
        case 'id_bodega_d':
          data[key] = transaccion[key].id_bodega
          break;

        case 'id_numemp':
          data[key] = transaccion[key].id_numemp
          break;

        case 'id_tipomov':
          data[key] = transaccion[key].id_tipomov
          break;

        case 'productos':
          data[key] = transaccion.productos
          break;

        case 'cliente':
          if (transaccion[key] != null) {
            data[key] = transaccion[key].id || null;            
          }else{
            data[key] = null;
          }
          break; 

        case 'departamento':
          data[key] = transaccion[key].id
          break; 

        case 'cod_transportista':
          data[key] = transaccion[key].id
          break; 

        default:
          data[key] = transaccion[key]
          break;
      }
    }
    
    return new Promise( resolve => {
      this.http.post(`${ URL }/invtransacciones`, data).subscribe( (resp: any) => {      
        console.log(resp);                         
        if (resp['code'] === 200)  {                                      
          this.transaccionGuardado.emit(resp.data);
          resolve(resp.data);
        }
      });
    });    
  }

  recibirTransaccion(transaccion: any) {
    
    const formData = new FormData();

    for(let key in transaccion){
      formData.append(key, transaccion[key])
    }
    
    return new Promise( resolve => {
      this.http.post(`${ URL }/recibir/invtransaccion/${transaccion.id}`, transaccion).subscribe( (resp: any) => {                        
        if (resp['code'] === 200)  {                                      
          this.transaccionGuardado.emit(resp.data);
          resolve(resp.data);
        }
      });
    }); 
  }

  transaccionesPendientes(email: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/invtransacciones-pendientes/${email}`).subscribe((resp: any) => {                           
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  repTransaccionesPendientes() {
    return new Promise( resolve => {
      this.http.get(`${URL}/reporte/invtransacciones-visualizar`).subscribe((resp: any) => {
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  detalleTransaccion(id: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/detalle/transaccion/${id}`).subscribe((resp: any) => {                          
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  borrarTransaccion(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/invtransacciones/${id}`).subscribe( (resp: any) => {                             
        if (resp['code'] === 200)  {            
          this.transaccionBorrada.emit(id);    
          resolve(resp.data);            
        }
      });
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
    params = params.append('categoria',parametro.categoria);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/categoria', {params}).subscribe((resp: any) => {                          
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  finalizando() {
    this.finalizar.emit(1);
  }
}
