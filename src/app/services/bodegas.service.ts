import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class BodegasService {

  bodegaGuardada = new EventEmitter();
  bodegaBorrada = new EventEmitter();
  bodegaActualizada = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  

  constructor(private http: HttpClient) {}

  busquedaBodega(parametro?: any) {
    let params = new HttpParams();
    
    params = params.append('bodega',parametro.bodega);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/bodega', {params}).subscribe((resp: any) => {  
          
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDatos() {
    return new Promise( resolve => {
        this.http.get(`${URL}/bodegas`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  getDato(id: any) {
    return new Promise( resolve => {
      this.http.get(`${URL}/bodegas/${id}`).subscribe((resp: any) => {        
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearBodega(bodega: any) {
    const formData = new FormData(); 
    
    for(let key in bodega){  
      switch (key) {          
        case 'id_pais':
          formData.append(key, bodega[key].id_pais)
          break;

        case 'id_ciudad':
          formData.append(key, bodega[key].id_ciudad)
          break;

        default:
          formData.append(key, bodega[key])
          break;
      }
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/bodegas`, formData).subscribe( resp => {
                   
          if (resp['code'] === 200) {    
            this.bodegaGuardada.emit( resp );                                   
            resolve(resp);       
          }
      });
    });    
  }

  actualizarBodega(id:number, bodega: any) {
    let formdata: any = {};
    for(let key in bodega){  
      if (key === 'id_ciudad' || key === 'id_pais') {
        formdata[key] = bodega[key].id         
      }else{
        formdata[key] = bodega[key]
      }
    }
      
    return new Promise( resolve => {
      this.http.put(`${ URL }/bodegas/${id}`, formdata)
          .subscribe( (resp: any) => {                                      
             
            if (resp['code'] === 200) {
              this.bodegaActualizada.emit( resp.data );                            
              resolve(resp);            
            }
          });
    });
  }
  
  borrarBodega(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/bodegas/${id}`)
          .subscribe( (resp: any) => {                             
            if (resp['code'] === 200) {            
              this.bodegaBorrada.emit(id);    
              resolve(resp);            
            }
          });
    });
  }

  permisosBodega(permisos: any) {    
    const formData = new FormData(); 
      
    for(let key in permisos){  
      formData.append(key, permisos[key])
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/permisos/bodegas`, formData).subscribe( resp => {  
         
        
        if (resp['code'] === 200) {    
          //this.bodegaGuardada.emit( resp );                                   
          resolve(resp);       
        }
      });
    });    
  }

  usuariosPermisosBodegas(id: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/usuarios/bodega/${id}`).subscribe((resp: any) => {        
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  
  autoLlenado(email: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/autollenado/bodega/${email}`).subscribe((resp: any) => {        
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  bodegasConpermisos(email: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/bodegas-usuarios/${email}`).subscribe((resp: any) => {        
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
