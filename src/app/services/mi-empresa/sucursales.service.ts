import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  sucursalesGuardada = new EventEmitter();
  sucursalesBorrada = new EventEmitter();
  sucursalesAct = new EventEmitter();
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

  busquedaSucursales(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('sucursales',parametro.sucursales);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/sucursales', {params}).subscribe((resp: any) => {                         
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/sucursales`).subscribe((resp: any) => {        
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }
  
  getDato(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/sucursales/${id}`).subscribe((resp: any) => { 
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  busquedaXempresa(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/busqueda/sucursales/${id}`).subscribe((resp: any) => {        
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
}
  
  crearSucursales(sucursales: any) {
    const formdata = {};
    
    for(let key in sucursales){   
      switch (key) {          
        case 'id_pais':
          formdata[key] = sucursales[key].id_pais;
          break;

        case 'cod_cia':
          formdata[key] = sucursales[key].cod_cia;
          break;

        case 'id_ciudad':
          formdata[key] = sucursales[key].id_ciudad;
          break;
        
          case 'id_region':            
          formdata[key] = sucursales[key].id_region;;
          break;

        case 'id_provincia':          
          formdata[key] = sucursales[key].id_provincia;;
          break;

        case 'id_municipio':            
          formdata[key] = sucursales[key].id_municipio;
          break;

        case 'id_sector':          
          formdata[key] = sucursales[key].id_sector;;
          break;

        default:
          formdata[key] = sucursales[key];
          break;
      }  
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/sucursales`, formdata).subscribe( (resp: any) => {
        if (resp['ok'])  {                                      
          resolve(resp.data);    
          this.sucursalesGuardada.emit(resp.data);       
        }
      }))
    });    
  }

  actualizarSucursales(id:number, sucursales: any) {  
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/sucursales/${id}`, sucursales).subscribe( (resp: any) => {  
        if (resp['ok'])  {
          this.sucursalesAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarSucursales(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/sucursales/${id}`).subscribe( (resp: any) => {                          
        if (resp['ok'])  {            
          this.sucursalesBorrada.emit(id);    
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
