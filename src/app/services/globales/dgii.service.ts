import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class DgiiService {
  
  rncEscogido = new EventEmitter();

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

  busquedaRNC(parametro?: any) {  
    let params = new HttpParams();
    params = params.append('rnc',parametro);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/dgii-rnc', {params}).subscribe((resp: any) => {
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getRNCS() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/dgii-rnc`).subscribe((resp: any) => {    
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/marca`).subscribe((resp: any) => {                                    
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/marca/${id}`).subscribe((resp: any) => {                                    
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  rncEscogidos(data) {
    this.rncEscogido.emit(data);
  }
}
