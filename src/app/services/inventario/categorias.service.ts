import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
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

  busquedaCategoria(parametro?: any) {
    let params = new HttpParams();      
    params = params.append('categoria',parametro);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/categoria', {params}).subscribe((resp: any) => {                            
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/categorias`).subscribe((resp: any) => {                       
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/categorias/${id}`).subscribe((resp: any) => {                        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearCategoria(bodega: any) {
    const formData = new FormData();    
    for(let key in bodega){  
      formData.append(key, bodega[key])
    }
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/categorias`, formData).subscribe( (resp:any) => {
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);    
          this.categoriaGuardada.emit( resp.data );       
        }
      }))
    });    
  }

  actualizarCategoria(id:number, categoria: any) {        
    return new Promise( resolve => {   
      this.listSubscribers.push(this.http.put(`${ URL }/categorias/${id}`, categoria).subscribe( (resp: any) => { 
        if (resp['code'] === 200)  {                  
          this.categoriaActualizada.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarCategoria(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/categorias/${id}`).subscribe( (resp: any) => { 
        if (resp['code'] === 200)  {            
          this.categoriaBorrada.emit(id);    
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
