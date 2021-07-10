import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class LiquidacionMercanciasService {

  liquidacionGuardada = new EventEmitter();
  liquidacionBorrada = new EventEmitter();
  liquidacionAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  formSubmitted = new EventEmitter();
  pendienteEnviadas = new EventEmitter();

  constructor(private http: HttpClient) { }

  busquedaLiquidacion(parametro?: any) {
    let params = new HttpParams();  
    params = params.append('liquidaciones',parametro);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/liquidaciones', {params}).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/liquidaciones/pendientes`).subscribe((resp: any) => {   
        console.log(resp);                         
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  autollenado() {
    return new Promise( resolve => {
      this.http.get(`${URL}/liquidaciones/autollenado`).subscribe((resp: any) => {   
        console.log(resp);                         
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/liquidaciones/${id}`).subscribe((resp: any) => { 
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearLiquidacion(liquidacion: any) {
    const formData = new FormData();  
    for(let key in liquidacion){  
      formData.append(key, liquidacion[key]);
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/liquidaciones`, formData).subscribe( (resp: any) => {
        this.formSubmitted.emit(false);                           
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);    
          this.liquidacionGuardada.emit(resp.data);       
        }
      });
    });    
  }

  actualizarLiquidacion(id:number, liquidacion: any) {  
    return new Promise( resolve => {
      this.http.put(`${ URL }/liquidaciones/${id}`, liquidacion).subscribe( (resp: any) => {                
        this.formSubmitted.emit(false);                           
        if (resp['code'] === 200)  {
          this.liquidacionAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      });
    });
  }

  borrarLiquidacion(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/liquidaciones/${id}`).subscribe( (resp: any) => {                          
        if (resp['code'] === 200)  {            
          this.liquidacionBorrada.emit(id);    
          resolve(resp.data);            
        }
      });
    });
  }

  pendienteEscogidas(data: any) {
    this.pendienteEnviadas.emit(data);
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
