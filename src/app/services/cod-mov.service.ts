import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UiMessagesService } from './ui-messages.service';
import { environment } from 'src/environments/environment';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class CodMovService {

  tipoMovGuardado = new EventEmitter();
  tipoMovBorrado = new EventEmitter();
  tipoMovActualizado = new EventEmitter();  
  actualizar = new EventEmitter();
  guardar = new EventEmitter();

  constructor(private http: HttpClient, private uimessage: UiMessagesService) {}

  busquedaCodMov(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('titulo',parametro.titulo);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/codigosmovimientos', {params}).subscribe((resp: any) => {  
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  getDatos() {
    return new Promise( resolve => {
        this.http.get(`${URL}/codigosmovimientos`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  getDato(cuenta: string) {
    return new Promise( resolve => {
        this.http.get(`${URL}/codigosmovimientos/${cuenta}`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  crearTipoMov(tipoMov: any) {
    let data = {};
    for (const key in tipoMov) {
      switch (key) {
        case 'origen':
          data[key] = tipoMov[key].value;
          break;
      
        default:
          data[key] = tipoMov[key]
          break;
      }
    }
    console.log(data);
    
    return new Promise( resolve => {
      this.http.post(`${ URL }/codigosmovimientos`, data).subscribe( resp => {  
          console.log(resp);
          
          if (resp['code'] === 200) {    
            this.tipoMovGuardado.emit( resp );                                   
            resolve(resp);       
          }
      });
    });    
  }

  actualizarTipoMov(id:number, tipoMov: any) {
    console.log(id);
    
    return new Promise( resolve => {      
      this.http.put(`${ URL }/codigosmovimientos/${id}`, tipoMov)
          .subscribe( (resp: any) => {    
            console.log(resp);
            if (resp['code'] === 200) {
              this.tipoMovActualizado.emit( resp.data );                            
              resolve(resp);            
            }
          });
    });
  }
  
  borrarTipoMov(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/codigosmovimientos/${id}`)
          .subscribe( (resp: any) => {                  
            
                       
            if (resp['code'] === 200) {            
              this.tipoMovBorrado.emit(id);    
              resolve(resp);            
            }
          });
    });
  }

  permisosMovimientos(permisos: any) {    
    const formData = new FormData(); 
      
    for(let key in permisos){  
      formData.append(key, permisos[key])
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/permisos/movimientos`, formData).subscribe( resp => {  
        console.log(resp);
        if (resp['code'] === 200) {
          resolve(resp);       
        }
      });
    });    
  }

  usuariosPermisosMov(id) {
    return new Promise( resolve => {
      this.http.get(`${URL}/usuarios/movimientos/${id}`).subscribe((resp: any) => {
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
