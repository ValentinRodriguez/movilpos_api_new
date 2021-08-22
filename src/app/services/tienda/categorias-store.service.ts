import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class CategoriasStoreService {
  
  constructor(private http: HttpClient) { }

  getDatos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/categorias-plaza`).subscribe((resp: any) =>{     
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      })
    })
  }
}
