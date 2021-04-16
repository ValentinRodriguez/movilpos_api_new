import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  marcaGuardada = new EventEmitter();
  marcaBorrada = new EventEmitter();
  marcaAct = new EventEmitter();
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
      this.http.get(`${URL}/marca`).subscribe((resp: any) => {                        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/marca/${id}`).subscribe((resp: any) => {                       
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearMarca(marcas: any) {
    const formData = new FormData();
    for(let key in marcas){  
      formData.append(key, marcas[key])
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/marca`, formData).subscribe( (resp: any) => {                         
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);    
          this.marcaGuardada.emit(resp.data);       
        }
      });
    });    
  }

  actualizarMarca(id:number, marca: any) {  
    return new Promise( resolve => {
      this.http.put(`${ URL }/marca/${id}`, marca).subscribe( (resp: any) => {
        this.formSubmitted.emit(false); 
        if (resp['code'] === 200)  {
          this.marcaAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      });
    });
  }

  borrarMarca(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/marca/${id}`).subscribe( (resp: any) => {
        this.formSubmitted.emit(false);                           
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
}

