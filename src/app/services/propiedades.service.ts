import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PropiedadesService {

  propiedadGuardada = new EventEmitter();
  propiedadBorrada = new EventEmitter();
  propiedadActualizada = new EventEmitter();
  formSubmitted = new EventEmitter();
  
  construct: string;
  usuario: any;

  constructor(private http: HttpClient) { }

  busquedaPropiedad(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('propiedad',parametro.propiedad);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/propiedades', {params}).subscribe((resp: any) => {                                    
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDatos() {
    return new Promise( resolve => {
      return this.http.get(`${URL}/propiedades`).subscribe((resp: any) => {                     
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id) {
    return new Promise( resolve => {
      return this.http.get(`${URL}/propiedades/${id}`).subscribe((resp: any) => {                      
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearPropiedad(propiedad: any) {
    const formData = new FormData();
    for(let key in propiedad){  
      formData.append(key, propiedad[key])
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/propiedades`, formData).subscribe( (resp:any) => {  
        this.formSubmitted.emit(false);
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);    
          this.propiedadGuardada.emit( resp.data );       
        }
      });
    });    
  }

  actualizarPropiedad(id:string, propiedad: any) {        
    return new Promise( resolve => {
      this.http.put(`${ URL }/propiedades/${id}`, propiedad).subscribe( (resp: any) => {   
        this.formSubmitted.emit(false);
        if (resp['code'] === 200)  {                  
          this.propiedadActualizada.emit( resp.data );                            
          resolve(resp.data);            
        }
      });
    });
  }

  borrarPropiedad(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/propiedades/${id}`).subscribe( (resp: any) => {
        if (resp['code'] === 200)  {            
          this.propiedadBorrada.emit(id);    
          resolve(resp.data);            
        }
      });
    });
  }
}
