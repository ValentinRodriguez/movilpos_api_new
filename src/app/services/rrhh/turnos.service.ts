import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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
      this.listSubscribers.push(this.http.get(URL+'/busqueda/turnos', {params}).subscribe((resp: any) => {                         
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {   
    return new Promise(resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/turnos`).subscribe((resp: any) => {                    
        if (resp['ok'])  {   
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/turnos/${id}`).subscribe((resp: any) => { 
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
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
      this.listSubscribers.push(this.http.post(`${ URL }/turnos`, formData).subscribe( (resp: any) => {
        if (resp['ok'])  {                                      
          resolve(resp.data);    
          this.turnoGuardada.emit(resp.data);       
        }
      }))
    });    
  }

  actualizarTurno(id:number, turno: any) {  
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/turnos/${id}`, turno).subscribe( (resp: any) => {   
        if (resp['ok'])  {
          this.turnoAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarTurno(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/turnos/${id}`).subscribe( (resp: any) => {                          
        if (resp['ok'])  {            
          this.turnoBorrada.emit(id);    
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
