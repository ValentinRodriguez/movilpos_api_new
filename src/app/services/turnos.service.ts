import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DatosEstaticosService } from './datos-estaticos.service';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  turnoGuardada = new EventEmitter();
  turnoBorrada = new EventEmitter();
  turnoAct = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient, private datosEstaticos: DatosEstaticosService) { }

  busquedaTurno(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('turnos',parametro.turnos);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/turnos', {params}).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDatos() {   
    return new Promise(resolve => {
      this.http.get(`${URL}/turnos`).subscribe((resp: any) => {                    
        if (resp['code'] === 200)  {          
          this.formSubmitted.emit(false);
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.http.get(`${URL}/turnos/${id}`).subscribe((resp: any) => { 
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearTurno(turno: any, horai:string, horaf: string) {
    const formData = new FormData();
    turno['horario_inicial'] = horai;
    turno['horario_final'] = horaf;
    
    for(let key in turno){  
      formData.append(key, turno[key]);
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/turnos`, formData).subscribe( (resp: any) => {
        this.formSubmitted.emit(false);
        console.log(resp);        
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);    
          this.turnoGuardada.emit(resp.data);       
        }
      });
    });    
  }

  actualizarTurno(id:number, turno: any) {  
    return new Promise( resolve => {
      this.http.put(`${ URL }/turnos/${id}`, turno).subscribe( (resp: any) => {                
        this.formSubmitted.emit(false);                           
        if (resp['code'] === 200)  {
          this.turnoAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      });
    });
  }

  borrarTurno(id: string) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/turnos/${id}`).subscribe( (resp: any) => {                          
        if (resp['code'] === 200)  {            
          this.turnoBorrada.emit(id);    
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
