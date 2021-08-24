import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class ZonasService {
  
  zonaGuardada = new EventEmitter();
  zonaBorrada = new EventEmitter();
  zonaAct = new EventEmitter();
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
      this.listSubscribers.push(this.http.get(`${URL}/zonas`).subscribe((resp: any) => {  
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  busquedaZona(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('zona',parametro.zona);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/zonas', {params}).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }
  
  getDato(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/zonas/${id}`).subscribe((resp: any) => { 
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getZonaProvincia(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/busqueda/zonas-provincias/${id}`).subscribe((resp: any) => {
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearZona(zona: any) {
    const formData = new FormData();  
    for(let key in zona){  
      formData.append(key, zona[key]);
    }
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/zonas`, zona).subscribe( (resp: any) => {
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);    
          this.zonaGuardada.emit(resp.data);       
        }
      }))
    });    
  }

  actualizarZona(id:number, zona: any) {  
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/zonas/${id}`, zona).subscribe( (resp: any) => {    
        if (resp['code'] === 200)  {
          this.zonaAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarZona(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/zonas/${id}`).subscribe( (resp: any) => {                          
        if (resp['code'] === 200)  {            
          this.zonaBorrada.emit(id);    
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
