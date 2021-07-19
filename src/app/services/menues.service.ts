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
      this.http.get(`${URL}/menu`).subscribe(resp => {                
        if (resp['code'] === 200)  {                           
          resolve(resp['data']);            
        }
      });
    });
  }

  getMenu(id: number) {
    let localMenues = JSON.parse(localStorage.getItem('menues'));
    let menues: any[] = []
    
    return new Promise( resolve => {
      if (localMenues === null) { 
        this.http.get(`${URL}/menu/${id}`).subscribe((resp: any) => { 
          if (resp['code'] === 200)  {   
            console.log(resp.data);                
            resolve(resp.data);            
          }
        })
      }else{
        localMenues.forEach(element => {
          if (element.modulo == id) {
            menues.push(element);      
          }
        });
        resolve(menues);
      }
    })      
  }
}
