import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  display = false
  facturaCreada = new EventEmitter()
  modoVenta = new EventEmitter();

  constructor(private http: HttpClient) {}
  
  getDatos() {
    return new Promise( resolve => {
        this.http.get(`${URL}/vefacturas`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  buscaFactura(id: any) {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/factura/${id}`).subscribe((resp: any) => {        
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  buscaOrdenPedido(id: any) {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/orden/${id}`).subscribe((resp: any) => { 
                        
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearFactura(factura: any) {
    const formData = new FormData(); 
    
    // for(let key in factura){  
    //   if (key === 'id_ciudad' || key === 'id_pais') {
    //     formData.append(key, factura[key].id)          
    //   }else{
    //     formData.append(key, factura[key])
    //   }
    // }

    return new Promise( resolve => {
      this.http.post(`${ URL }/vefacturas`, factura).subscribe( resp => {
                   
          if (resp['code'] === 200) {    
            this.facturaCreada.emit( resp );                                   
            resolve(resp);       
          }
      });
    });    
  }

  modoDeVenta(modo) {
    this.modoVenta.emit(modo)
  }

}
