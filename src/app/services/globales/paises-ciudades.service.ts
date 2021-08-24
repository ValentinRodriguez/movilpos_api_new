import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PaisesCiudadesService {

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

  getPaises() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/pais`).subscribe((resp: any) => {
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      }))
    })
  }
  
  localidades() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/autollenado/localidades`).subscribe((resp: any) => {
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getCiudades() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/ciudad`).subscribe((resp: any) => {                        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getProvincias() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/provincias`).subscribe((resp: any) => {                        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  buscaRegion(id: string) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/region/pais/${id}`).subscribe((resp: any) => {  
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  buscaProvincias(id: string) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/provincias/region/${id}`).subscribe((resp: any) => {  
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  buscaMunicipios(id: string) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/municipios/region/${id}`).subscribe((resp: any) => {  
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  buscaCiudad(id: string) {    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/ciudad/municipio/${id}`).subscribe((resp: any) => {          
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getNacionalidades() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/nacionalidades`).subscribe((resp: any) => {
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      }))
    })
  }

  buscaSector(id: string) {    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/sectores/ciudad/${id}`).subscribe((resp: any) => {          
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }
}
