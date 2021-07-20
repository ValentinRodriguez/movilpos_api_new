import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  display = new EventEmitter();
  facturaCreada = new EventEmitter()
  modoVenta = new EventEmitter();
  enviaData = new EventEmitter();
  
  guardando = new EventEmitter();
  metodo = new EventEmitter();
  constructor(private http: HttpClient) {}
  
  getDatos() {
    return new Promise( resolve => {
        this.http.get(`${URL}/vefacturas`).subscribe((resp: any) => {
          if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
      })
    })
  }

  getDato() {
    return new Promise( resolve => {
        this.http.get(`${URL}/vefacturas`).subscribe((resp: any) => {
          if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
      })
    })
  }

  buscaFactura(id: any) {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/factura/${id}`).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  buscaOrdenPedido(id: any) {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/orden/${id}`).subscribe((resp: any) => {                             
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearFactura(factura: any) {
    return new Promise( resolve => {
      this.http.post(`${ URL }/vefacturas`, factura).subscribe( (resp: any) => {                   
        this.guardando.emit(false);
        console.log(resp);
        
        if (resp['code'] === 200)  {    
          this.facturaCreada.emit( resp );                                   
          resolve(resp.data);       
        }
      });
    });    
  }

  crearFacturaPrestamo(factura: any) {
    return new Promise( resolve => {
      this.http.post(`${ URL }/cctransacciones`, factura).subscribe( (resp: any) => {                   
        this.guardando.emit(false);
        console.log(resp);        
        if (resp['code'] === 200)  {    
          this.facturaCreada.emit( resp );                                   
          resolve(resp.data);       
        }
      });
    });    
  }

  enviarData(data) {
    this.enviaData.emit(data)
  }

  modoDeVenta(modo) {
    this.modoVenta.emit(modo)
  }

  metodoPago(data) {
    this.metodo.emit(data)
  }

  displayDetalle() {
    this.display.emit(true)
  }

}
