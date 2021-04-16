import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class EntradasDiarioService {

  entradaGuardada = new EventEmitter();
  marcaBorrada = new EventEmitter();
  entradaAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  busquedaMarca(parametro?: any) {
  
    let params = new HttpParams();
    params = params.append('marca',parametro);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/marca', {params}).subscribe((resp: any) => {
          if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/cgentradasdiarios`).subscribe((resp: any) => {
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/cgentradasdiarios/${id}`).subscribe((resp: any) => {               
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getEdsec() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/ed/secuencia`).subscribe((resp: any) => {                                      
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearEntrada(entradas: any) {
    return new Promise( resolve => {
      this.http.post(`${ URL }/cgentradasdiarios`, entradas).subscribe( (resp: any) => { 
        this.formSubmitted.emit(false);
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);   
          this.entradaGuardada.emit(resp.data); 
        }
      });
    });      
  }

  actualizarEntrada(id:number, ent: any) {      
    return new Promise( resolve => {  
      this.http.put(`${ URL }/cgentradasdiarios/${id}`, ent).subscribe( (resp: any) => {
        this.formSubmitted.emit(false);          
        if (resp['code'] === 200)  {
          this.entradaAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      });
    });
  }

  borrarMarca(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/marca/${id}`).subscribe( (resp: any) => {                                        
        if (resp['code'] === 200)  {            
          this.marcaBorrada.emit(id);    
          resolve(resp.data);            
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

  verificaEntrada(ref) {   
    let params = new HttpParams().set('ref',ref);
    return new Promise( resolve => {
      this.http.get(`${URL}/transacciones-cg/verificaEntrada`,{params}).subscribe((resp: any) => {
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }
}