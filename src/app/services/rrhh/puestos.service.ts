import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PuestosService {

  puestoGuardada = new EventEmitter();
  puestoBorrada = new EventEmitter();
  puestoAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  
  
  constructor(private http: HttpClient) { }

  busquedaPuesto(parametro?: any) {
    let params = new HttpParams();
    params = params.append('puesto',parametro.monedas);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/nopuestos', {params}).subscribe((resp: any) => {            
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/nopuestos`).subscribe((resp: any) => {
        console.log(resp);
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }
  
  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/nopuestos/${id}`).subscribe((resp: any) => {                          
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearPuesto(puesto: any) {
    const formData = new FormData();  
    for(let key in puesto){  
      formData.append(key, puesto[key]);
    }
    return new Promise( resolve => {
      this.http.post(`${ URL }/nopuestos`, formData).subscribe( (resp: any) => {
        
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);    
          this.puestoGuardada.emit(resp.data);       
        }
      });
    });    
  }

  actualizarPuesto(id:number, puesto: any) {  
    return new Promise( resolve => {
      this.http.put(`${ URL }/nopuestos/${id}`, puesto).subscribe( (resp: any) => {
                             
        if (resp['code'] === 200)  {
          this.puestoAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      });
    });
  }

  borrarPuesto(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/nopuestos/${id}`).subscribe( (resp: any) => {           
        if (resp['code'] === 200)  {            
          this.puestoBorrada.emit(id);    
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
