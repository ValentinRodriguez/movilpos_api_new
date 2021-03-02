import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class ZonasService {

  constructor(private http: HttpClient) {}

  getDatos() {
    return new Promise( resolve => {      
      this.http.get(`${URL}/zonas`).subscribe((resp: any) => {      
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }
}
