import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class DireccionesService implements OnDestroy{

  direccionGuardada = new EventEmitter();
  direccionBorrada = new EventEmitter();
  direccionActualizada = new EventEmitter();
  direccionEscogida = new EventEmitter();
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

  busquedaDireccion(parametro?: any) {
    let params = new HttpParams();      
    params = params.append('direccion',parametro);    
    return new Promise( resolve => {
    this.listSubscribers.push(this.http.get(URL+'/busqueda/direccion', {params}).subscribe((resp: any) => {
          if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {
    return new Promise( resolve => {
     this.listSubscribers.push(this.http.get(`${URL}/direccion-envio`).subscribe((resp: any) => {
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {
    return new Promise( resolve => {
     this.listSubscribers.push(this.http.get(`${URL}/direccion-envio/${id}`).subscribe((resp: any) => {                                   
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearDireccion(direccion: any) {
    let data = {}
    for(let key in direccion){         
      switch (key) {
        case 'id_ciudad':
        case 'id_pais':            
          data[key] = direccion[key].id;          
        break;

        default:
          data[key] = direccion[key]
          break;
      }
    }
    return new Promise( resolve => {
     this.listSubscribers.push(this.http.post(`${ URL }/direccion-envio`, data).subscribe( (resp:any) => { 
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);    
          this.direccionGuardada.emit( resp.data );       
        }
      }))
    });    
  }

  actualizarDireccion(id:number, direccion: any) { 
    let data = {}
    for(let key in direccion){         
      switch (key) {
        case 'id_ciudad':
        case 'id_pais':            
          data[key] = direccion[key].id;          
        break;

        default:
          data[key] = direccion[key]
          break;
      }
    }       
    return new Promise( resolve => {
     this.listSubscribers.push(this.http.put(`${ URL }/direccion-envio/${id}`, data).subscribe( (resp: any) => {                                    
        if (resp['code'] === 200)  {                  
          this.direccionActualizada.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarDireccion(id: string) {
    return new Promise( resolve => {      
     this.listSubscribers.push(this.http.delete(`${ URL }/direccion-envio/${id}`).subscribe( (resp: any) => {
        if (resp['code'] === 200)  {            
          this.direccionBorrada.emit(id);    
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

  direccionEscogidas(direccion) {
    this.direccionEscogida.emit(direccion);
  }
}
