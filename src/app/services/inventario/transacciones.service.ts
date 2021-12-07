import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  transaccionGuardado = new EventEmitter();
  transaccionBorrada = new EventEmitter();  
  finalizar = new EventEmitter();

  listSubscribers: any = [];
  
  constructor(private http: HttpClient) { }

  getDatos() {
    return this.http.get(`${URL}/invtransacciones`)
  }

  autoLlenado() {
    return this.http.get(`${URL}/autollenado/invtransacciones`)
  }

  crearTransaccion(transaccion: any) {
    let data = {}
    
    for(let key in transaccion){  
      switch (key) {
        case 'id_bodega':
        case 'id_bodega_d':
          data[key] = transaccion[key].id_bodega
          break;

        case 'id':
          data[key] = transaccion[key].id
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
    
    return this.http.post(`${ URL }/invtransacciones`, data)   
  }

  recibirTransaccion(transaccion: any) {
    
    const formData = new FormData();

    for(let key in transaccion){
      formData.append(key, transaccion[key])
    }
    
    return this.http.post(`${ URL }/recibir/invtransaccion/${transaccion.id}`, transaccion)
  }

  repTransaccionesPendientes() {
    return this.http.get(`${URL}/reporte/invtransacciones-visualizar`)
  }

  detalleTransaccion(id: string) {
    return this.http.get(`${URL}/detalle/transaccion/${id}`)
  }

  borrarTransaccion(id: string) {
    return this.http.delete(`${ URL }/invtransacciones/${id}`)
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
    return this.http.get(URL+'/busqueda/categoria', {params})
  }

  finalizando() {
    this.finalizar.emit(1);
  }
}
