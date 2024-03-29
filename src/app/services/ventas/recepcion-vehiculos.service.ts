import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RecepcionVehiculosService {

  recepcionGuardada = new EventEmitter();
  recepcionBorrada = new EventEmitter();
  recepcionAct = new EventEmitter();
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

  busquedaRecepcion(parametro?: any) {
    let params = new HttpParams();
        
    params = params.append('recepciones',parametro);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/recepcion-vehiculos', {params}).subscribe((resp: any) => {                         
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/recepcion-vehiculos`).subscribe((resp: any) => {                    
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  autoLlenado() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/autollenado/recepcion-vehiculos`).subscribe((resp: any) => {  
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/recepcion-vehiculos/${id}`).subscribe((resp: any) => { 
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearRecepcion(recepcion: any) {
    let archivos = recepcion.archivos;

    let i = 0;
    const formData = new FormData(); 
    for(let key in recepcion){   
      switch (key) {
        case 'archivos':
          for (let i = 0; i < archivos.length; i++) {           
            formData.append('archivos'+[i], archivos[i], archivos[i].name );
          }        
          formData.append('archivosLength', archivos.length);
        break;
        
        case 'fabricacion':
          formData.append(key, recepcion[key].value);
          break;

        case 'cliente':
        case 'id_brand':
        case 'id_categoria':
        case 'id_propiedad':           
          formData.append(key, recepcion[key].id);
        break;

        case 'inspecciones':          
          formData.append(key, JSON.stringify(recepcion[key]));
          break;

        default:
          formData.append(key, recepcion[key]);
        break;
      }
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/recepcion-vehiculos`, recepcion).subscribe( (resp: any) => {     
        if (resp['ok'])  {                                      
          resolve(resp.data);    
          this.recepcionGuardada.emit(resp.data);       
        }
      }))
    });    
  }

  actualizarRecepcion(id:number, recepcion: any) {  
    const archivos = recepcion.archivos;
    let i = 0;
    const formData = new FormData(); 

    for(let key in recepcion){   
      switch (key) {
        case 'archivos':          
          for (let i = 0; i < archivos.length; i++) {  
            if (typeof(archivos[i]) == 'object') {
              formData.append('archivos'+[i], archivos[i], archivos[i].name );              
              formData.append('archivosLength', archivos.length);
            }else{
              formData.append(key, recepcion[key]);
            }
          }        
        break;
        
        case 'fabricacion':
          formData.append(key, recepcion[key].value);
          break;

        case 'cliente':
        case 'id_brand':
        case 'id_categoria':
        case 'id_propiedad':           
          formData.append(key, recepcion[key].id);
        break;

        case 'inspecciones':          
          formData.append(key, JSON.stringify(recepcion[key]));
          break;

        default:
          formData.append(key, recepcion[key]);
        break;
      }
    }
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/recepcion-vehiculos/${id}`, formData).subscribe( (resp: any) => { 
        if (resp['ok'])  {
          this.recepcionAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarRecepcion(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/recepcion-vehiculos/${id}`).subscribe( (resp: any) => {                                          
        if (resp['ok'])  {            
          this.recepcionBorrada.emit(id);    
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
