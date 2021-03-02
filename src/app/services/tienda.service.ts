import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  constructor(private http: HttpClient) { }

  actProductosTienda(page: number) {
    return this.http.get(`${URL}/woocommerce/actprecio/${page}`);
  }

  contarProductosTienda(page: number) {
    return this.http.get(`${URL}/woocommerce/contarprecio/${page}`);
  }
}
