import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
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

  constructor(private http: HttpClient,
              private usuarioService:UsuarioService) { }

  busquedaMarca(parametro?: any) {
  
    let params = new HttpParams();
    params = params.append('marca',parametro);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/marca', {params}).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/cgentradasdiarios`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/cgentradasdiarios/${id}`).subscribe((resp: any) => {
         
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  getEdsec() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/ed/secuencia`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  crearEntrada(entradas: any) {
        
    return new Promise( resolve => {
      this.http.post(`${ URL }/cgentradasdiarios`, entradas).subscribe( (resp: any) => { 
       //  
          if (resp['code'] === 200) {                                      
            resolve(resp.data);    
          
            this.entradaGuardada.emit(resp.data);  
             
          }
      });
    });    
    
  }
  actualizarEntrada(id:number, ent: any) {      
    return new Promise( resolve => {
     
      this.http.put(`${ URL }/cgentradasdiarios/${id}`, ent)
              .subscribe( (resp: any) => {  
                       
                if (resp['code'] === 200) {
                  this.entradaAct.emit( resp.data );                            
                  resolve(resp);            
                }
              });
    });
  }

  borrarMarca(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/marca/${id}`)
          .subscribe( (resp: any) => {
            if (resp['code'] === 200) {            
              this.marcaBorrada.emit(id);    
              resolve(resp);            
            } else {
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