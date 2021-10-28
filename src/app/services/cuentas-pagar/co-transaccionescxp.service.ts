import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../../environments/environment";

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CoTransaccionescxpService {

  facturaGuardada = new EventEmitter();
  facturaBorrada = new EventEmitter();
  facturaAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  facturaEscogida = new EventEmitter();
  
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

  busquedaFactura(parametro?: any) {
    let params = new HttpParams();       
    params = params.append('factura',parametro);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/transacciones-cxp', {params}).subscribe((resp: any) => {                          
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  autoLlenado() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/autollenado/transacciones-cxp`).subscribe((resp: any) => {      
        if (resp['ok'])  {          
            resolve(resp.data);            
        }
      }))
    })
  }
  
  getDatos() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/transacciones-cxp`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  facturasPendientes() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/facturas-pendientes/transacciones-cxp`).subscribe((resp: any) => {                           
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/transacciones-cxp/${id}`).subscribe((resp: any) => {                       
        if (resp['ok'])  {          
            resolve(resp.data);            
        }
      }))
    })
  }

  verificaNCF(proveedor, ncf) {   
    let params = new HttpParams().set('proveedor',proveedor).set('ncf',ncf);
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/transacciones-cxp/verificancf`,{params}).subscribe((resp: any) => {                                  
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearFactura(factura: any) {
    let data = {}
    for (const key in factura) {   
      switch (key) {
        case 'cond_pago':
        case 'moneda':
        case 'codigo_fiscal':
          data[key] = factura[key].id
          break;

        case 'tipo_orden':
          if (factura.tipo_orden === undefined) {
            data[key] = null            
          }else{
            data[key] = factura[key].id
          }
          break;

        default:
          data[key] = factura[key]
          break;
      }      
    }
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/transacciones-cxp`, data).subscribe( (resp: any) => {   
        if (resp['ok'])  {                                      
          resolve(resp.data);    
          this.facturaGuardada.emit(resp.data);       
        }
      }))
    });    
  }

  actualizarFactura(id:number, factura: any) {  
    let data = {}
    for (const key in factura) {   
      switch (key) {
        case 'cond_pago':
        case 'moneda':
        case 'codigo_fiscal':
          data[key] = factura[key].id        
        break;

        case 'tipo_orden':
          if (factura.tipo_orden === undefined) {
            data[key] = null            
          }else{
            data[key] = factura[key].id
          }
          break;

        default:
          data[key] = factura[key]
          break;
      }      
    }
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/transacciones-cxp/${id}`, data).subscribe( (resp: any) => {                          
        if (resp['ok'])  {
          this.facturaAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarFactura(id: number) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/transacciones-cxp/${id}`).subscribe( (resp: any) => {   
        if (resp['ok'])  {            
        this.facturaBorrada.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }

  listadoFacturasEscogidas(factura: any) {
    this.facturaEscogida.emit(factura);
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
