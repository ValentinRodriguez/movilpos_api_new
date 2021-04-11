import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})

export class MenuesService {

  constructor(private http: HttpClient) { }

  getMenues() {
    return new Promise( resolve => {
      this.http.get(`${ URL }/menu`).subscribe( resp => {                              
          if (resp['code'] === 200)  {                           
            resolve(resp['data']);            
          }
        });
    });
  }

  getMenu(id) {
    return new Promise( resolve => {
      this.http.get(`${URL}/menu/${id}`).subscribe((resp: any) => {   
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }
}
