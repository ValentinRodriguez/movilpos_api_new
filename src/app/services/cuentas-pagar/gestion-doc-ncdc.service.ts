import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class GestionDocNcdcService {

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
    return new Promise(resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/gestion-documentos-ndnc`).subscribe((resp: any) =>{
        if (resp.code===200){
          resolve(resp.data); 
        } 
      }))      
    })
  }

  crearDocumento(data: any) {
    return new Promise(resolve => {
      this.listSubscribers.push(this.http.post(`${URL}/gestion-documentos-ndnc`,data).subscribe((resp: any) => {                          
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))      
    })
  }
}
