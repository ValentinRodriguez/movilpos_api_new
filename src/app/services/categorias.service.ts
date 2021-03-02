import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  categoriaGuardada = new EventEmitter();
  categoriaBorrada = new EventEmitter();
  categoriaActualizada = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  
  constructor(private http: HttpClient) { 
              }

  busquedaCategoria(parametro?: any) {
    let params = new HttpParams();      
    params = params.append('categoria',parametro);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/categoria', {params}).subscribe((resp: any) => { 
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  getDatos() {
    return new Promise( resolve => {
      return this.http.get(`${URL}/categorias`).subscribe((resp: any) => {
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id) {
    return new Promise( resolve => {
      return this.http.get(`${URL}/categorias/${id}`).subscribe((resp: any) => {
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearCategoria(bodega: any) {
    const formData = new FormData();
    
    for(let key in bodega){  
      formData.append(key, bodega[key])
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/categorias`, formData)
          .subscribe( (resp:any) => {
          if (resp['code'] === 200) {                                      
            resolve(resp);    
            this.categoriaGuardada.emit( resp.data );       
          }
      });
    });    
  }

  actualizarCategoria(id:number, categoria: any) {        
    return new Promise( resolve => {   
      this.http.put(`${ URL }/categorias/${id}`, categoria)
          .subscribe( (resp: any) => { 
            if (resp['code'] === 200) {                  
              this.categoriaActualizada.emit( resp.data );                            
              resolve(resp);            
            }
          });
    });
  }

  borrarCategoria(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/categorias/${id}`)
          .subscribe( (resp: any) => {                             
            if (resp['code'] === 200) {            
              this.categoriaBorrada.emit(id);    
              resolve(resp);            
            } else {
              resolve(false);
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
