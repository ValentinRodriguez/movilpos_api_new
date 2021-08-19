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
    return this.http.get(`${URL}/productos-plaza`);
  }

  crearProducto(data) {
    return this.http.post(`${URL}/productos-plaza`,data);
  }

  actProductosTienda(page: number) {
    return this.http.get(`${URL}/productos-plaza`);
  }

  borrarProducto(page: number) {
    return this.http.get(`${URL}/productos-plaza`);
  }

  contarProductosTienda(page: number) {
    return this.http.get(`${URL}/productos-plaza`);
  }

  tipoProductos(data: any) {
    this.tipoProducto.emit(data)
  }
}
