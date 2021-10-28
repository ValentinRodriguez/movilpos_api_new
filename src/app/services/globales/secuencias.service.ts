import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class SecuenciasService {

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

  secuenciaDocumentos(tipo:string, cuenta_no:string) {
    let params = new HttpParams().set('tipo',tipo)
                                 .set('cuenta_no',cuenta_no);

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/secuencias/cgtransacciones`,{params}).subscribe((resp: any) => {                          
            if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }
}
