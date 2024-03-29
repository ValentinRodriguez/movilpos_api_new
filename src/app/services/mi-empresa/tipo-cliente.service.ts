import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class TipoClienteService {

  tipoClienteguardado = new EventEmitter();
  tipoClienteBorrado = new EventEmitter();
  tipoClienteAct = new EventEmitter();
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

  getDatos(){
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/tipoclientes`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id:number){
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/tipoclientes/${id}`).subscribe((resp: any) => {          
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  busquedaTipo(parametro) {    
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     

    params = params.append('descripcion',parametro.descripcion);

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/tipoclientes', {params}).subscribe((resp: any) => {                         
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearTipoCliente(tipoCliente: any) {    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/tipoclientes`, tipoCliente).subscribe( (resp: any) => {
        
        if (resp['ok'])  {    
          this.tipoClienteguardado.emit( resp.data );                                   
          resolve(resp.data);       
        }
      }))
    });    
  }

  borrarTipoCliente(id) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/tipoclientes/${id}`).subscribe( (resp: any) => {                          
        if (resp['ok'])  {            
          this.tipoClienteBorrado.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }

  actualizarTipoCliente(id:number, tipo: any) {  
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/tipoclientes/${id}`, tipo).subscribe( (resp: any) => {     
        if (resp['ok'])  {
          this.tipoClienteAct.emit( resp.data );                            
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
