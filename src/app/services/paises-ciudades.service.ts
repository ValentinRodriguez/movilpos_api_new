import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PaisesCiudadesService {

  constructor(private http: HttpClient) { }

  getPaises() {
    return new Promise( resolve => {
      this.http.get(`${URL}/pais`).subscribe((resp: any) => {
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  getCiudades() {
    return new Promise( resolve => {
      this.http.get(`${URL}/ciudad`).subscribe((resp: any) => {                        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getCiudadesXpaises(id: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/ciudad/pais/${id}`).subscribe((resp: any) => {  
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }
}
