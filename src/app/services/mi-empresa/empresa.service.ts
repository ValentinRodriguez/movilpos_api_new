import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../../environments/environment";

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})

export class EmpresaService {
  
  empresaEscogida = new EventEmitter();
  empresaBorrada = new EventEmitter();
  empresaCreada = new EventEmitter();
  empresaAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  
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
      this.listSubscribers.push(this.http.get(URL+'/busqueda/empresa', {params}).subscribe((resp: any) => { 
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  autoLlenadoPermisos() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/autollenado/permisos-empresa`).subscribe((resp: any) => { 
        if (resp['ok'])  {                                      
          resolve(resp.data);            
        }
      }))
    })
  }

  getEmpresa() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/empresa`).subscribe((resp: any) => {                                            
        if (resp['ok'])  {                                      
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/empresa`).subscribe((resp: any) => {  
        if (resp['ok'])  {                                      
          resolve(resp.data);            
        }
      }))
    })
  }


  autoLlenado() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/autollenado-empresa`).subscribe((resp: any) => {  
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }                                      

  getPermisosEmpresa() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/permisos-empresa`).subscribe((resp: any) => {                            
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/empresa/${id}`).subscribe((resp: any) => {        
        if (resp['ok'])  {                                      
          resolve(resp.data);            
        }
      }))
    })
  }

  showEmpresa(empresa: string) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/empresa/${empresa}`).subscribe((resp: any) => {                                            
        if (resp['ok'])  {                                      
          resolve(resp.data);            
        }
      }))
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
          
        case 'id_ciudad':          
        formData.append(key, empresa[key].id_ciudad);
          break;
  
        case 'id_pais':          
             formData.append(key, empresa[key].id_pais);
          break
  
        case 'id_region':            
             formData.append(key,empresa[key].id_region);
          break;
  
        case 'id_provincia':          
             formData.append(key,empresa[key].id_provincia);
          break;
  
        case 'id_municipio':            
             formData.append(key,empresa[key].id_municipio);
          break;
  
        case 'id_sector':          
             formData.append(key,empresa[key].id_sector);
          break;

        default:
          formData.append(key, empresa[key])
          break;
      } 
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/act/empresa/${id}`, formData).subscribe( (resp: any) => {                                    
        if (resp['ok'])  {                                      
          resolve(resp.data);       
        }
      }))
    });    
  }

  crearEmpresa(empresa) {
    const formData = new FormData();
    const formdata = {};

    for(let key in empresa){   
      switch (key) {        
        case 'moneda':
          formdata[key] = JSON.stringify(empresa[key]);         
          break;
          
        case 'id_pais':
          formdata[key] = empresa[key].id_pais
          break;

        case 'id_ciudad':
          formdata[key] = empresa[key].id_ciudad
          break;
        
        case 'id_region':            
        formdata[key] = empresa[key].id_region
          break;

        case 'id_provincia':          
        formdata[key] = empresa[key].id_provincia
          break;

        case 'id_municipio':            
         formdata[key] = empresa[key].id_municipio
          break;

        case 'id_sector':          
         formdata[key] = empresa[key].id_sector
          break;
        
        case 'tipo_documento':          
          formdata[key] = empresa[key].id
           break;

        default:
          formdata[key] = empresa[key]
          break;
      }  
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/empresa`, formdata).subscribe((resp: any) => {         
        if (resp['ok'])  {                                      
          this.empresaCreada.emit(resp.data);
          resolve(resp.data);      
        }
      }))
    });    
  }

  guardarPermisosEmpresa(data) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/permisos-empresa`, data).subscribe((resp: any) => {   
        if (resp['ok'])  {                                      
          resolve(resp.data);      
        }
      }))
    }); 
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }

}
