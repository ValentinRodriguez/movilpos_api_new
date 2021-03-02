import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ModulosService {

  constructor(private http: HttpClient) { }

  getModulos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/modulos`)
               .subscribe( resp => {     
                 if (resp['code'] === 200) {                           
                   resolve(resp['data']);            
                 }
               });
    });
  }
}
