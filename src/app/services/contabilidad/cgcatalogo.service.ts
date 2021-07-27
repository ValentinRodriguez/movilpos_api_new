import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CgcatalogoService {

  catalogoActualizado = new EventEmitter();
  catalogoBorrado = new EventEmitter();
  catalogoEscogido = new EventEmitter();
  catalogoGuardado = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  
  
  constructor(private http: HttpClient) { }

  busqueda(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }  
    params = params.append('descripcion',parametro.descripcion);  
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/desc-cgcatalogo',{params}).subscribe((resp: any) => {                                              
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  busquedaCatalogo(parametro) {
    let params = new HttpParams();    
    params = params.append('cuenta_no',parametro);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/cgcatalogo', {params}).subscribe((resp: any) => {                           
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDatos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/cgcatalogo`).subscribe((resp: any) => {                          
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDatosAux() {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/cuentas-auxiliares`).subscribe((resp: any) => {  
        
                                
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  codigosRetencion() {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/codigos-retencion`).subscribe((resp: any) => {
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id: any) {
    return new Promise( resolve => {
      this.http.get(`${URL}/cgcatalogo/${id}`).subscribe((resp: any) => {        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }
  
  crearCgcatalogos(cgcatalogo: any) {
    if (cgcatalogo.aplica_a === undefined) {
      cgcatalogo.aplica_a = cgcatalogo.cuenta_no;
    }
    const formData = new FormData();
    for(let key in cgcatalogo){  
      switch (key) {
        case 'analitico':
        case 'catalogo':
        case 'depto':
        case 'referencia':
        case 'retencion':
        case 'tipo_cuenta':   
        case 'nivel':
        case 'grupo':
        case 'origen':
        case 'selectivo_consumo':
          formData.append(key, cgcatalogo[key].value)
          break;
        case 'cuenta_resultado':
          if (cgcatalogo[key] === true) {
            formData.append(key, 'si')
          } else {
            formData.append(key, 'no')
          }
          break;
        case 'codigo_isr':
          formData.append(key, cgcatalogo[key].id)
          break;
        default:
          formData.append(key, cgcatalogo[key])
          break;
      }      
    }
    
    return new Promise( resolve => {
      this.http.post(`${ URL }/cgcatalogo`, formData).subscribe( (resp: any) => {
                                   
        if (resp['code'] === 200)  {
          resolve(resp.data);       
          this.catalogoGuardado.emit(resp.data);
        }
      });
    });    
  }

  actualizarCatalogo(id:number, cgcatalogo: any) {  
    const formData = {};
    if (cgcatalogo.aplica_a === undefined) {
      cgcatalogo.aplica_a = cgcatalogo.cuenta_no;
    }

    for(let key in cgcatalogo){  
      switch (key) {
        case 'analitico':
        case 'catalogo':
        case 'depto':
        case 'referencia':
        case 'retencion':
        case 'tipo_cuenta':   
        case 'nivel':
        case 'grupo':
        case 'origen':
        case 'selectivo_consumo':          
          formData[key] = cgcatalogo[key].value
          break;

        case 'cuenta_resultado':
          if (cgcatalogo[key] === true) {
            formData[key] = 'si';
          } else {
            formData[key] = 'no';
          }
          break;

        case 'codigo_isr':
          formData[key] =cgcatalogo[key].id
          break;

        default:
          formData[key] =cgcatalogo[key]
          break;
      }      
    }
      
    return new Promise( resolve => {
      this.http.put(`${ URL }/cgcatalogo/${id}`, formData).subscribe( (resp: any) => {
                                     
          if (resp['code'] === 200)  {
            this.catalogoActualizado.emit( resp.data );                            
            resolve(resp.data);            
          }
      });
    });
  }

  borrarCatalogo(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/cgcatalogo/${id}`).subscribe( (resp: any) => {   
                               
        if (resp['code'] === 200)  {
          this.catalogoBorrado.emit(id);    
          resolve(resp.data);            
        }
      });
    });
  }

  listadocatalogoEscogidos(data: any) {
    this.catalogoEscogido.emit(data);
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}


