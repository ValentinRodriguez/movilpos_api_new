import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TransportistasService {

  trasnportistaGuardado = new EventEmitter();
  trasnportistaBorrado = new EventEmitter();
  trasnportistaAct = new EventEmitter();
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

  getDatos() {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.get(`${URL}/transportistas`).subscribe((resp: any) => {                 
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id: any) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/transportistas/${id}`).subscribe((resp: any) => {      
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearTransportista(transportista: any) {
    const formdata = {};
    
    for(let key in transportista){  
      switch (key) {
        case 'id_ciudad':          
        formdata[key] = transportista[key].id_ciudad;
        break;

        case 'id_pais':          
          formdata[key] = transportista[key].id_pais;
          break;

        case 'id_region':            
          formdata[key] = transportista[key].id_region;
          break;

        case 'id_provincia':          
          formdata[key] = transportista[key].id_provincia;
          break;

        case 'id_municipio':            
          formdata[key] = transportista[key].id_municipio
          break;

        case 'id_sector':          
          formdata[key] = transportista[key].id_sector;
          break;
      
        default:
          formdata[key] = transportista[key];
          break;
      }
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/transportistas`, formdata).subscribe( (resp: any) => {  
         if (resp['ok'])  {    
          this.trasnportistaGuardado.emit( resp.data );                                   
          resolve(resp.data);       
        }
      }))
    });    
  }

  actualizarTransportista(id:number, transportista: any) {
    let formdata: any = {};
    for(let key in transportista){  
      switch (key) {        
        case 'id_pais':
        case 'cod_provincia':
          formdata[key] = transportista[key].id    
          break;
      
        default:
          formdata[key] = transportista[key]
          break;
      }
    }
      
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/transportistas/${id}`, formdata).subscribe( (resp: any) => {
        if (resp['ok'])  {
          this.trasnportistaAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarTransportista(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/transportistas/${id}`).subscribe( (resp: any) => {                          
        if (resp['ok'])  {            
          this.trasnportistaBorrado.emit(id);    
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
