import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ExistenciaAlmacenesService {

  existenciaGuardada = new EventEmitter();
  existenciaBorrada = new EventEmitter();
  existenciaAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  existenciasAlmacen(data: any) {
    console.log(data);    
    for(let key in data){   
      switch (key) {
      
        case 'id_tipoinventario': 
          data[key] = data[key].id_tipoinventario || '';      
        break;
        
        case 'id_bodega':
          data[key] = data[key].id_bodega  || '';
        break;

        case 'id_producto':
          data[key] = data[key].id || '';
        break;  

        default:
          
        break;
      }
    }
    return new Promise( resolve => {
      this.http.post(`${URL}/existencias-almacen`,data).subscribe((resp: any) => {  
        console.log(resp);                          
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  autoLlenado() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/existencias-almacen`).subscribe((resp: any) => { 
        console.log(resp);                   
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
