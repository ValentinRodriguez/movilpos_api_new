import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AreasEmpresaService {

  areaGuardada = new EventEmitter();
  areaBorrada = new EventEmitter();
  areaAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  
  
  constructor(private http: HttpClient) { }

  busquedaArea(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('areas',parametro.areas);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/areas-empresa', {params}).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/areas-empresa`).subscribe((resp: any) => {           
        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  autoLlenado() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/autollenado/areas-empresa`).subscribe((resp: any) => {                    
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/areas-empresa/${id}`).subscribe((resp: any) => { 
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearArea(area: any) {    
    const formData = new FormData();  
    for(let key in area){  
      formData.append(key, area[key]);
    }

    for(let key in area){  
      switch (key) {
        
        case 'cod_cia':          
          formData.append(key, area[key].cod_cia)
          break;
        
        case 'suc_id':
        case 'departamento':   
          formData.append(key, area[key].id)
          break;
        
        default:          
          formData.append(key, area[key])
          break;
      }
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/areas-empresa`, formData).subscribe( (resp: any) => {
        
        
        
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);    
          this.areaGuardada.emit(resp.data);       
        }
      });
    });    
  }

  actualizarArea(id: number, area: any) {
    let formData = {};
    
    for(let key in area){  
      switch (key) {
        
        case 'cod_cia':          
          formData[key] = area[key].cod_cia
          break;
        
        case 'suc_id':
        case 'departamento':   
          formData[key] = area[key].id;
          break;
        
        default:          
          formData[key] = area[key];
          break;
      }
    }

    return new Promise( resolve => {
      this.http.put(`${ URL }/areas-empresa/${id}`, formData).subscribe( (resp: any) => {                
        
        
        
        if (resp['code'] === 200)  {
          this.areaAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      });
    });
  }

  borrarArea(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/areas-empresa/${id}`).subscribe( (resp: any) => {                          
        if (resp['code'] === 200)  {            
          this.areaBorrada.emit(id);    
          resolve(resp.data);            
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
