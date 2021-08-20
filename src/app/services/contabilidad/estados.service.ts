import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  llamarEstado = new EventEmitter();

  constructor(private http: HttpClient) { }

  getDatos() {
    return this.http.get(`${URL}/estados`);
  }

  getDato(id: string) {
    console.log(id);    
    return this.http.get(`${URL}/estados/${id}`);
  }

  busquedaEstado(parametro: string) {
    console.log(parametro);
    
    let params = new HttpParams();  
    params = params.append('estado',parametro);   
    return this.http.get(`${URL}/busqueda-estados`,{params});
  }
  
  crearEstado(data: any) {
    return this.http.post(`${URL}/estados`, data);
  }

  actualizarEstado(id: any, data:any){
    return this.http.put(`${URL}/estados/${id}`,data);
  }

  borrarEstado(id: any) {
    return this.http.delete(`${URL}/estados/${id}`);
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
