import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  constructor(private http: HttpClient) { }

  getDatos() {
    return this.http.get(`${URL}/estados`);
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
}
