import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {
  departamentoEscogido = new EventEmitter();
  departamentoBorrado = new EventEmitter();
  departamentoAct= new EventEmitter();
  
  guardar = new EventEmitter();
  actualizar = new EventEmitter();
  
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

  getDatos() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/departamentos`).subscribe((resp: any) => {                                    
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id: any) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/departamentos/${id}`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearDepartamento(departamento: any) {
    const formData = new FormData();     
    for(let key in departamento){  
      formData.append(key, departamento[key])
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/departamentos`, formData).subscribe( (resp: any) => {  
        if (resp['ok'])  {   
          this.departamentoEscogido.emit( resp );                                   
          resolve(resp.data);       
        }
      }))
    });    
  }

  actualizarDepartamento(id:number, departamento: any) {
    const formData = new FormData(); 
    
    for(let key in departamento){  
      formData.append(key, departamento[key])
    }
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/departamentos/${id}`, departamento).subscribe( (resp: any) => {
        if (resp['ok'])  {
          this.departamentoAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }
  
  borrarDepartamento(id) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${URL}/departamentos/${id}`).subscribe((resp: any) => {        
        if (resp['ok'])  {            
          this.departamentoBorrado.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }

  busqueda(parametro) {    
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     

    params = params.append('departamento',parametro.departamento);

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/departamentos', {params}).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  listadoProveedoresEscogidos(productos: any) {
    this.departamentoEscogido.emit(productos);
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
