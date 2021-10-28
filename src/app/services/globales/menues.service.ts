import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})

export class MenuesService {

  listSubscribers: any = [];
  
  constructor(private http: HttpClient) { }

  ngOnDestroy() {
    console.log('destruido');    
    this.listSubscribers.forEach(a => {
      if (a !== undefined) {
        a.unsubscribe()        
      }
    });
  }
  
  getMenues() {
    return this.http.get(`${URL}/modulos/menues`);
  }

  getMenu(id: number) {
    let localMenues = JSON.parse(localStorage.getItem('menues'));
    let menues: any[] = []
    
    return new Promise( resolve => {
      if (localMenues === null) { 
        this.listSubscribers.push(this.http.get(`${URL}/menu/${id}`).subscribe((resp: any) => { 
          if (resp['ok'])  {
            resolve(resp.data);            
          }
        }))
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
