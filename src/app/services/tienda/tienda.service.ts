import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  
  guardar = new EventEmitter();
  productoGuardado= new EventEmitter();
  productoBorrada= new EventEmitter();
  productoAct= new EventEmitter();
  actualizando = new EventEmitter();
  tipoProducto = new EventEmitter();

  constructor(private http: HttpClient) { }

  getDatos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/productos-plaza`).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      })
    })
  }

  crearProducto(data) {
    return new Promise( resolve => {
      this.http.post(`${URL}/productos-plaza`,data).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      })
    })
  }

  actProductosTienda(page: number) {
    return new Promise( resolve => {
      this.http.get(`${URL}/productos-plaza`).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      })
    })
  }

  borrarProducto(page: number) {
    return new Promise( resolve => {
      this.http.get(`${URL}/productos-plaza`).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      })
    })
  }

  contarProductosTienda(page: number) {
    return new Promise( resolve => {
      this.http.get(`${URL}/productos-plaza`).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }

  tipoProductos(data: any) {
    return new Promise( resolve => {
      this.http.post(`${URL}/productos-plaza`,data).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
      })
    })
  }
}
