import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  
  constructor(private http: HttpClient) { }

  getDatos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/woocommerce`).subscribe((resp: any) => {
        
        console.log(resp);
        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearProducto(data) {
    return new Promise( resolve => {
      this.http.post(`${URL}/woocommerce`,data).subscribe((resp: any) => {
        
        console.log(resp);        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  actProductosTienda(page: number) {
    return this.http.get(`${URL}/woocommerce/actprecio/${page}`);
  }

  contarProductosTienda(page: number) {
    return this.http.get(`${URL}/woocommerce/contarprecio/${page}`);
  }
}
