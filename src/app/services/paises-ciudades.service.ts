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

  getProvincias() {
    return new Promise( resolve => {
      this.http.get(`${URL}/provincias`).subscribe((resp: any) => {                        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  buscaRegion(id: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/region/pais/${id}`).subscribe((resp: any) => {  
        console.log(resp);        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  buscaProvincias(id: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/provincias/region/${id}`).subscribe((resp: any) => {  
        console.log(resp);        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  buscaMunicipios(id: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/municipios/region/${id}`).subscribe((resp: any) => {  
        console.log(resp);        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  buscaCiudad(id: string) {
    console.log(id);    
    return new Promise( resolve => {
      this.http.get(`${URL}/ciudad/municipio/${id}`).subscribe((resp: any) => {  
        console.log(resp);        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getNacionalidades() {
    return new Promise( resolve => {
      this.http.get(`${URL}/nacionalidades`).subscribe((resp: any) => {
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  buscaSector(id: string) {
    console.log(id);    
    return new Promise( resolve => {
      this.http.get(`${URL}/sectores/ciudad/${id}`).subscribe((resp: any) => {  
        console.log(resp);        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }
}
