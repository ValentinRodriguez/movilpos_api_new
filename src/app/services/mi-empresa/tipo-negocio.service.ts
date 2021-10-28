import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TipoNegocioService {

  tipoNegocioguardado = new EventEmitter();
  tipoNegocioBorrado = new EventEmitter();
  tipoNegocioAct = new EventEmitter();
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

  busquedaTipoN(parametro) {
    let params = new HttpParams();
    params = params.append('descripcion',parametro);    
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.get(URL+'/busqueda/tiponegocios', {params}).subscribe((resp: any) => {                                  
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos(){
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/tiponegocios`).subscribe((resp: any) => {                       
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id:number){
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/tiponegocios/${id}`).subscribe((resp: any) => {                                   
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearTipoNegocio(tipoNegocio: any) {    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/tiponegocios`, tipoNegocio).subscribe( (resp: any) => {    
        if (resp['ok'])  {    
          this.tipoNegocioguardado.emit( resp.data );                                   
          resolve(resp.data);       
        }
      }))
    });    
  }

  borrarTipoNegocio(id) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/tiponegocios/${id}`).subscribe( (resp: any) => {                         
        if (resp['ok'])  {            
          this.tipoNegocioBorrado.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }

  actualizarTipoNegocio(id:number, tipo: any) {  
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/tiponegocios/${id}`, tipo).subscribe( (resp: any) => {  
        if (resp['ok'])  {
          this.tipoNegocioAct.emit( resp.data );                            
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
