import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {

  localidadesGuardada = new EventEmitter();
  localidadesBorrada = new EventEmitter();
  localidadesAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  busquedaLocalidades(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('localidades',parametro.localidades);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/localidades', {params}).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/localidades`).subscribe((resp: any) => {                    
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/localidades/${id}`).subscribe((resp: any) => { 
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearLocalidades(localidades: any) {
    const formdata = {};
    
    for(let key in localidades){   
      switch (key) {
        case 'descripcion':
          formdata[key] = JSON.stringify(localidades[key]);
          break;
          
        case 'id_pais':
          formdata[key] = localidades[key].id_pais;
          break;

        case 'id_ciudad':
          formdata[key] = localidades[key].id_ciudad;
          break;
        
          case 'id_region':            
          formdata[key] = localidades[key].id_region;;
          break;

        case 'id_provincia':          
          formdata[key] = localidades[key].id_provincia;;
          break;

        case 'id_municipio':            
          formdata[key] = localidades[key].id_municipio;
          break;

        case 'id_sector':          
          formdata[key] = localidades[key].id_sector;;
          break;

        default:
          formdata[key] = localidades[key];
          break;
      }  
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/localidades`, formdata).subscribe( (resp: any) => {
        this.formSubmitted.emit(false);                           
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);    
          this.localidadesGuardada.emit(resp.data);       
        }
      });
    });    
  }

  actualizarLocalidades(id:number, localidades: any) {  
    return new Promise( resolve => {
      this.http.put(`${ URL }/localidades/${id}`, localidades).subscribe( (resp: any) => {                
        this.formSubmitted.emit(false);                           
        if (resp['code'] === 200)  {
          this.localidadesAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      });
    });
  }

  borrarLocalidades(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/localidades/${id}`).subscribe( (resp: any) => {                          
        if (resp['code'] === 200)  {            
          this.localidadesBorrada.emit(id);    
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
