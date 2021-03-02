import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  autoLlenado() {
    return new Promise( resolve => {
      return this.http.get(`${URL}/autollenado/home`).subscribe((resp: any) => {
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        } else {
          resolve(false);
        }
      })
    })
  }
}
