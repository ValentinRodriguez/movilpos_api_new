import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../environments/environment";

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
  facturaEscogida  = new EventEmitter();
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  busquedaFactura(parametro?: any) {
    let params = new HttpParams();
       
    params = params.append('factura',parametro);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/transacciones-cxp', {params}).subscribe((resp: any) => {  
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }

  autoLlenado() {
    return new Promise( resolve => {
        this.http.get(`${URL}/autollenado/transacciones-cxp`).subscribe((resp: any) => {      
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      })
    })
  }
  
  getDatos() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/transacciones-cxp`).subscribe((resp: any) => {
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }

  facturasPendientes() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/facturas-pendientes/transacciones-cxp`).subscribe((resp: any) => {                     
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/transacciones-cxp/${id}`).subscribe((resp: any) => {
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }

  verificaNCF(proveedor, ncf) {   
    let params = new HttpParams().set('proveedor',proveedor).set('ncf',ncf);
    return new Promise( resolve => {
      this.http.get(`${URL}/transacciones-cxp/verificancf`,{params}).subscribe((resp: any) => {
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
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
    console.log(data);
    
    return new Promise( resolve => {
      this.http.post(`${ URL }/transacciones-cxp`, data).subscribe( (resp: any) => {  
                     console.log(resp);
                     
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {                                      
            resolve(resp);    
            this.facturaGuardada.emit(resp.data);       
          }
      });
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
      this.http.put(`${ URL }/transacciones-cxp/${id}`, data)      
          .subscribe( (resp: any) => {
             this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {
              this.facturaAct.emit( resp.data );                            
              resolve(resp);            
            }
          });
    });
  }

  borrarFactura(id: number) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/transacciones-cxp/${id}`).subscribe( (resp: any) => {
          console.log(resp);
          
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {            
            this.facturaBorrada.emit(id);    
              resolve(resp);            
            }
          });
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
