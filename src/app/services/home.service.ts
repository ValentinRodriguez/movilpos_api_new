import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  finalizar = new EventEmitter();
  formSubmitted  = new EventEmitter();
  constructor(private http: HttpClient) { }

  autoLlenado() {
    return new Promise( resolve => {
      return this.http.get(`${URL}/autollenado/home`).subscribe((resp: any) => {
        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  
  finalizando() {
    this.finalizar.emit(1);
  }
}
