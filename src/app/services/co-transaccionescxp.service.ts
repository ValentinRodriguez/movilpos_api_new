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

  constructor(private http: HttpClient) { }

  busquedaFactura(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('facturas',parametro.facturas);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/transacciones-cxp', {params}).subscribe((resp: any) => {  
          console.log(resp);          
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  autoLlenado() {
    return new Promise( resolve => {
        this.http.get(`${URL}/autollenado/transacciones-cxp`).subscribe((resp: any) => {   
          console.log(resp)     
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }
  
  getDatos() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/transacciones-cxp`).subscribe((resp: any) => {
          console.log(resp)   
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/transacciones-cxp/${id}`).subscribe((resp: any) => {
          console.log(resp);
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  crearFactura(factura: any) {
    const formData = new FormData();  
    for(let key in factura){  
      formData.append(key, factura[key]);
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/transacciones-cxp`, formData).subscribe( (resp: any) => {
          if (resp['code'] === 200) {                                      
            resolve(resp);    
            this.facturaGuardada.emit(resp.data);       
          }
      });
    });    
  }

  actualizarFactura(id:number, factura: any) {  
    return new Promise( resolve => {
      this.http.put(`${ URL }/transacciones-cxp/${id}`, factura)
          .subscribe( (resp: any) => {                
            console.log(resp);
            
            if (resp['code'] === 200) {
              this.facturaAct.emit( resp.data );                            
              resolve(resp);            
            }
          });
    });
  }

  borrarFactura(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/transacciones-cxp/${id}`)
          .subscribe( (resp: any) => {
            if (resp['code'] === 200) {            
              this.facturaBorrada.emit(id);    
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
