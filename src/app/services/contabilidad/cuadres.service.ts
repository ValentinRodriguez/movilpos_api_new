import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../../environments/environment";

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CuadresService {

  cuadreGuardada = new EventEmitter();
  cuadreBorrada = new EventEmitter();
  cuadreAct = new EventEmitter();
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

  busquedaCuadre(parametro?: any) {
    let params = new HttpParams();  
    params = params.append('cuadre-caja',parametro.cuadres);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/cuadre-caja', {params}).subscribe((resp: any) => {                         
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/cuadre-caja`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  autoLlenado() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/autollenado/cuadre-caja`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/cuadre-caja/${id}`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearCuadre(cuadre: any) {
    const formData = new FormData();  
    for(let key in cuadre){  
      formData.append(key, cuadre[key]);
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/cuadre-caja`, formData).subscribe( (resp: any) => {
                                   
        if (resp['ok'])  {                                      
          resolve(resp.data);    
          this.cuadreGuardada.emit(resp.data);       
        }
      }))
    });    
  }

  actualizarCuadre(id:number, cuadre: any) {  
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/cuadre-caja/${id}`, cuadre).subscribe( (resp: any) => { 
        if (resp['ok'])  {
          this.cuadreAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarCuadre(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${URL}/cuadre-caja/${id}`).subscribe((resp: any) => {
        if (resp['ok'])  {            
          this.cuadreBorrada.emit(id);    
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
