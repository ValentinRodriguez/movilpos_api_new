import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../environments/environment";

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})

export class EmpresaService {
  
  empresaEscogida = new EventEmitter();
  empresaBorrada = new EventEmitter();
  empresaAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  busquedaEmpresa(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('empresa',parametro.empresa);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/empresa', {params}).subscribe((resp: any) => {         
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }
  
  getEmpresa() {
    return new Promise( resolve => {
      this.http.get(`${URL}/empresa`).subscribe((resp: any) => {
        if (resp['code'] === 200) {                                      
          resolve(resp.data);            
        }
      })
    })
  }

  getDatos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/empresa`).subscribe((resp: any) => {
         
        if (resp['code'] === 200) {                                      
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id) {
    return new Promise( resolve => {
      this.http.get(`${URL}/empresa/${id}`).subscribe((resp: any) => {
         
        if (resp['code'] === 200) {                                      
          resolve(resp.data);            
        }
      })
    })
  }

  showEmpresa(empresa: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/empresa/${empresa}`).subscribe((resp: any) => {
        if (resp['code'] === 200) {                                      
          resolve(resp.data);            
        }
      })
    })
  }

  actEmpresa(empresa, id) {
    const formData = new FormData();
    let imagesSec = empresa.logo;
    
    for(let key in empresa){    
      switch (key) {
        case 'logo':
          if (typeof imagesSec !== 'string') {   
            formData.append('logo', imagesSec, imagesSec.name );    
            formData.append('logo', imagesSec.length)          
          } else {
            formData.append('logo', imagesSec);
          }         
          break;

        case 'moneda':
          formData.append(key, JSON.stringify(empresa[key]));          
          break;
          
        case 'id_pais':
          formData.append(key, empresa[key].id_pais)
          break;

        case 'id_ciudad':
          formData.append(key, empresa[key].id_ciudad)
          break;

        default:
          formData.append(key, empresa[key])
          break;
      } 
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/act/empresa/${id}`, formData)
               .subscribe( resp => {  
                
                 
               if (resp['code'] === 200) {                                      
                 resolve(resp);       
               }
      });
    });    
  }

  crearEmpresa(empresa) {
    const formData = new FormData();
    
    for(let key in empresa){   
      switch (key) {
        case 'moneda':
          formData.append(key, JSON.stringify(empresa[key]));          
          break;
          
        case 'id_pais':
          formData.append(key, empresa[key].id_pais)
          break;

        case 'id_ciudad':
          formData.append(key, empresa[key].id_ciudad)
          break;

        default:
          formData.append(key, empresa[key])
          break;
      }  
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/empresa`, formData)
               .subscribe( resp => {           
                  
                 
               if (resp['code'] === 200) {                                      
                 resolve(resp);      
               }
      });
    });    
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }

}
