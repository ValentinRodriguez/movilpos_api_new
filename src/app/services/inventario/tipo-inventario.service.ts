import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TipoInventarioService {

  TipoInventarioGuardado = new EventEmitter();
  TipoInventarioBorrado = new EventEmitter();
  TipoInventarioAct = new EventEmitter();
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

  busquedaTipoInv(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('invtipo',parametro.invtipo);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/invtipos', {params}).subscribe((resp: any) => { 
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/invtipos`).subscribe((resp: any) => {                       
        if (resp['ok'])  {                    
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/invtipos/${id}`).subscribe((resp: any) =>{                       
        if (resp['ok'])  {                    
          resolve(resp.data);            
        }
      }))
    })
  }

  crearTipoInventario(bodega: any) {
    const formData = new FormData();

    for(let key in bodega){  
      if (key === 'cuenta_no') {
        formData.append(key, bodega[key].cuenta_no)          
      }else{
        formData.append(key, bodega[key])
      }
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/invtipos`, formData).subscribe( (resp: any) => {        
        if (resp['ok'])  {                                      
          resolve(resp.data);    
          this.TipoInventarioGuardado.emit(resp.data);        
        }
      }))
    });    
  }

  borrarTipoInventario(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/invtipos/${id}`).subscribe( (resp: any) => {                          
        if (resp['ok'])  {            
          this.TipoInventarioBorrado.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }

  actualizartipoInv(id:number, invTipo: any) {
    let formData = {};
    for(let key in invTipo){  
      if (key === 'cuenta_no') {
        formData[key] = invTipo[key].cuenta_no         
      }else{
        formData[key] = invTipo[key]
      }
    }
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/invtipos/${id}`, formData).subscribe( (resp: any) => {          
        if (resp['ok'])  {
          this.TipoInventarioAct.emit( resp.data );                            
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

