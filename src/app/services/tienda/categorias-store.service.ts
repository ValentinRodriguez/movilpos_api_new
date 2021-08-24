import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class CategoriasStoreService {
  
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

  getDatos() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/categorias-plaza`).subscribe((resp: any) =>{     
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      }))
    })
  }
}
