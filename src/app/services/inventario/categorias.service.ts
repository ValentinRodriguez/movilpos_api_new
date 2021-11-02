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
    return this.http.get(URL+'/categorias/busqueda', {params})
  }

  getDatos() {
    return this.http.get(`${URL}/categorias`);
  }

  getDato(id) {
    return this.http.get(`${URL}/categorias/${id}`);
  }

  crearCategoria(categoria: any) {
    return this.http.post(`${ URL }/categorias`, categoria);    
  }

  actualizarCategoria(id:number, categoria: any) {        
    return this.http.put(`${ URL }/categorias/${id}`, categoria)
  }

  borrarCategoria(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/categorias/${id}`).subscribe( (resp: any) => { 
        if (resp['ok'])  {            
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
