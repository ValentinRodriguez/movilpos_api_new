import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {
  departamentoEscogido = new EventEmitter();
  departamentoBorrado = new EventEmitter();
  departamentoAct= new EventEmitter();
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  getDatos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/departamentos`).subscribe((resp: any) => {
         this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getDato(id: any) {
    return new Promise( resolve => {
      this.http.get(`${URL}/departamentos/${id}`).subscribe((resp: any) => {    
         this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearDepartamento(departamento: any) {
    const formData = new FormData();     
    for(let key in departamento){  
      formData.append(key, departamento[key])
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/departamentos`, formData).subscribe( (resp: any) => {               
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {    
            this.departamentoEscogido.emit( resp );                                   
            resolve(resp.data);       
          }
      });
    });    
  }

  actualizarDepartamento(id:string, departamento: any) {
    const formData = new FormData(); 
    
    for(let key in departamento){  
      formData.append(key, departamento[key])
    }
    
    return new Promise( resolve => {
      this.http.put(`${ URL }/departamentos/${id}`, departamento)
          .subscribe( (resp: any) => {                                      
             
             this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {
              this.departamentoAct.emit( resp.data );                            
              resolve(resp.data);            
            }
          });
    });
  }
  
  borrarDepartamento(id) {
    return new Promise( resolve => {      
      this.http.delete(`${ URL }/departamentos/${id}`)
          .subscribe( (resp: any) => {                                         
             this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {            
              this.departamentoBorrado.emit(id);    
              resolve(resp.data);            
            }
          });
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
      this.http.get(URL+'/busqueda/departamentos', {params}).subscribe((resp: any) => {        
           this.formSubmitted.emit(false);                           
            if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
        })
    })
  }

  listadoProveedoresEscogidos(productos: any) {
    this.departamentoEscogido.emit(productos);
  }
}
