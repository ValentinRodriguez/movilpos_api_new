import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class EstadosService  implements OnDestroy{

  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  llamarEstado = new EventEmitter();

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
  
  getDatos() {
    return new Promise(resolve => {
       this.listSubscribers.push(this.http.get(`${URL}/estados`).subscribe((resp: any) => {
        if (resp.code === 200) {
          resolve(resp.data)
        }     
      }))     
    })
  }

  getDato(id: string) {
    return new Promise(resolve => {
       this.listSubscribers.push(this.http.get(`${URL}/estados/${id}`).subscribe((resp: any) => {
        if (resp.code === 200) {
          resolve(resp.data)
        } 
      }))
    })   
  }

  busquedaEstado(parametro: string) {    
    let params = new HttpParams();  
    params = params.append('estado', parametro);
    return new Promise(resolve => {
       this.listSubscribers.push(this.http.get(`${URL}/busqueda-estados`, { params }).subscribe((resp: any) => {
        if (resp.code === 200) {
          resolve(resp.data)
        } 
      }))      
    })
  }
  
  crearEstado(data: any) {
    return new Promise(resolve => {
       this.listSubscribers.push(this.http.post(`${URL}/estados`, data).subscribe((resp: any) => {
        if (resp.code === 200) {
          resolve(resp.data)
        } 
      }))      
    })
  }

  actualizarEstado(id: any, data:any){    
    return new Promise(resolve => {
       this.listSubscribers.push(this.http.put(`${URL}/estados/${id}`, data).subscribe((resp: any) => {
        if (resp.code === 200) {
          resolve(resp.data)
        } 
      }))      
    })
  }

  borrarEstado(id: any) {
    return new Promise(resolve => {
       this.listSubscribers.push(this.http.delete(`${URL}/estados/${id}`).subscribe((resp: any) => {
        if (resp.code === 200) {
          resolve(resp.data)
        } 
      }))      
    })
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
