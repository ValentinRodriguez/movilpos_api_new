import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class ZonasService {
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient) {}

  getDatos() {
    return new Promise( resolve => {      
      this.http.get(`${URL}/zonas`).subscribe((resp: any) => {      
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
      })
    })
  }
}
