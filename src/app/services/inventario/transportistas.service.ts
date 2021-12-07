import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TransportistasService {

  trasnportistaGuardado = new EventEmitter();
  trasnportistaBorrado = new EventEmitter();
  trasnportistaAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  getDatos() {
    return this.http.get(`${URL}/transportistas`)
  }

  getDato(id: any) {
    return this.http.get(`${URL}/transportistas/${id}`)
  }

  crearTransportista(transportista: any) {
    console.log(transportista);    
    return this.http.post(`${ URL }/transportistas`, transportista)    
  }

  actualizarTransportista(id:number, transportista: any) {      
    return this.http.put(`${ URL }/transportistas/${id}`, transportista)
  }

  borrarTransportista(id: string) {
    return this.http.delete(`${ URL }/transportistas/${id}`)
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
