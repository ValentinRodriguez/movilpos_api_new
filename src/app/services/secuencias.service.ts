import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class SecuenciasService {

  constructor(private http: HttpClient) { }

  secuenciaDocumentos(tipo:string, cuenta_no:string) {
    let params = new HttpParams().set('tipo',tipo)
                                 .set('cuenta_no',cuenta_no);

    return new Promise( resolve => {
      return this.http.get(`${URL}/secuencias/cgtransacciones`,{params}).subscribe((resp: any) => {
        console.log(resp);
        
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }
}
