import { HttpClient } from '@angular/common/http';
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

  existenciasAlmacen(data: any) {
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
      this.listSubscribers.push(this.http.post(`${URL}/existencias-almacen`,data).subscribe((resp: any) => {  
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  autoLlenado() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/existencias-almacen`).subscribe((resp: any) => {                            
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
