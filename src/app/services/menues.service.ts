import { EventEmitter, Injectable } from '@angular/core';
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
      this.http.get(`${URL}/menu`).subscribe(resp => {                
        if (resp['code'] === 200)  {                           
          resolve(resp['data']);            
        }
      });
    });
  }

  getMenu(id: number, menu = '') {
    let localMenu = localStorage.getItem(menu);
    return new Promise( resolve => {
      if (localMenu === null) {        
        this.http.get(`${URL}/menu/${id}`).subscribe((resp: any) => { 
          if (resp['code'] === 200)  {   
            localStorage.setItem(menu, JSON.stringify(resp.data));   
            console.log(resp.data);                
            resolve(resp.data);            
          }
        })
      } else {
        resolve(JSON.parse(localMenu));            
      }
    })      
  }
}
