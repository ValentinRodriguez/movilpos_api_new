import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class EntradasDiarioService {

  entradaGuardada = new EventEmitter();
  marcaBorrada = new EventEmitter();
  entradaAct = new EventEmitter();
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

  busquedaMarca(parametro?: any) {
    let params = new HttpParams();
    params = params.append('marca',parametro);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/marca', {params}).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/cgentradasdiarios`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/cgentradasdiarios/${id}`).subscribe((resp: any) => {               
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getEdsec() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/ed/secuencia`).subscribe((resp: any) => {                                      
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearEntrada(entradas: any) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/cgentradasdiarios`, entradas).subscribe( (resp: any) => { 
        if (resp['ok'])  {                                      
          resolve(resp.data);   
          this.entradaGuardada.emit(resp.data); 
        }
      }))
    });      
  }

  actualizarEntrada(id:number, ent: any) {      
    return new Promise( resolve => {  
      this.listSubscribers.push(this.http.put(`${ URL }/cgentradasdiarios/${id}`, ent).subscribe( (resp: any) => {
        if (resp['ok'])  {
          this.entradaAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarMarca(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/marca/${id}`).subscribe( (resp: any) => {                                        
        if (resp['ok'])  {            
          this.marcaBorrada.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }
  
  verificaEntrada(ref) {   
    let params = new HttpParams().set('ref',ref);
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/transacciones-cg/verificaEntrada`,{params}).subscribe((resp: any) => {     
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