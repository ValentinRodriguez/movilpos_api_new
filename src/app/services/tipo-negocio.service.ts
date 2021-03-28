import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
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
  
  constructor(private http: HttpClient) {}

  busquedaTipoN(parametro) {
    let params = new HttpParams();

    params = params.append('descripcion',parametro);
    
    return new Promise( resolve => {
      
      this.http.get(URL+'/busqueda/tiponegocios', {params}).subscribe((resp: any) => {
         
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDatos(){
    return new Promise( resolve => {
        this.http.get(`${URL}/tiponegocios`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  getDato(id:number){
    return new Promise( resolve => {
        this.http.get(`${URL}/tiponegocios/${id}`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  crearTipoNegocio(tipoNegocio: any) {    
    return new Promise( resolve => {
      this.http.post(`${ URL }/tiponegocios`, tipoNegocio).subscribe( (resp: any) => {  
        
          if (resp['code'] === 200) {    
            this.tipoNegocioguardado.emit( resp );                                   
            resolve(resp);       
          }
      });
    });    
  }

  borrarTipoNegocio(id) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/tiponegocios/${id}`)
          .subscribe( (resp: any) => {                             
            if (resp['code'] === 200) {            
              this.tipoNegocioBorrado.emit(id);    
              resolve(resp);            
            }
          });
    });
  }

  actualizarTipoNegocio(id:number, tipo: any) {  
    return new Promise( resolve => {
      this.http.put(`${ URL }/tiponegocios/${id}`, tipo)
          .subscribe( (resp: any) => {
            
            if (resp['code'] === 200) {
              this.tipoNegocioAct.emit( resp.data );                            
              resolve(resp);            
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
