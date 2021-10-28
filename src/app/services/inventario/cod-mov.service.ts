import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
      this.listSubscribers.push(this.http.get(URL+'/busqueda/codigosmovimientos', {params}).subscribe((resp: any) => { 
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/codigosmovimientos`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(cuenta: string) {
    return new Promise( resolve => {
        this.listSubscribers.push(this.http.get(`${URL}/codigosmovimientos/${cuenta}`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
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
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/codigosmovimientos`, data).subscribe( (resp: any) => {  
        if (resp['ok'])  {    
          this.tipoMovGuardado.emit( resp.data );                                   
          resolve(resp.data);       
        }
      }))
    });    
  }

  actualizarTipoMov(id:number, tipoMov: any) {
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
    
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.put(`${ URL }/codigosmovimientos/${id}`, data).subscribe( (resp: any) => {   
        if (resp['ok'])  {
          this.tipoMovActualizado.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }
  
  borrarTipoMov(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/codigosmovimientos/${id}`).subscribe( (resp: any) => {                            
        if (resp['ok'])  {            
          this.tipoMovBorrado.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }

  permisosMovimientos(permisos: any) {    
    const formData = new FormData(); 
      
    for(let key in permisos){  
      formData.append(key, permisos[key])
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/permisos/movimientos`, formData).subscribe( (resp: any) => {                          
        if (resp['ok'])  {
          resolve(resp.data);       
        }
      }))
    });    
  }

  usuariosPermisosMov(id) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/usuarios/movimientos/${id}`).subscribe((resp: any) => {                   
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
