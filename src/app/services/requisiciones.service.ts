import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class RequisicionesService {

  requisicionact = new EventEmitter();
  requisicionGuardada= new EventEmitter();
  requisicionBorrada = new EventEmitter();
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  getDatos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/requisiciones`).subscribe((resp: any) => {               
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearRequisiciones(requisicion: any) {
    let productos = requisicion.productos;
    let documento = requisicion.documento;
    let i = 0;
    const formData = new FormData(); 
    
    for(let key in requisicion){   
      switch (key) {
        case 'documento':
          for (let i = 0; i < documento.length; i++) {           
            formData.append('documento'+[i], documento[i], documento[i].name );
          }        
          formData.append('documentoLength', documento.length)          
        break;
        
        case 'productos':
          productos.forEach(element => {
            Object.keys(element).forEach(prop=>{        
              formData.append(prop+[i], element[prop]);             
            }) 
            i++
            formData.append('productosLength', productos.length)
          });
        break;
        
        case 'cod_emp_sec':
          formData.append(key, requisicion[key].id)
        break;

        case 'cliente':
          formData.append(key, requisicion[key].nombre)
        break;
        
        case 'departamento':
          formData.append(key, requisicion[key].departamento)
        break;  

        case 'prioridad':
          formData.append(key, requisicion[key].value)
        break;

        default:
          formData.append(key, requisicion[key])
        break;
      }
    }
    
    return new Promise( resolve => {
      this.http.post(`${ URL }/requisiciones`, formData).subscribe( (resp: any) => {  
        this.formSubmitted.emit(false);
        if (resp['code'] === 200)  {    
          this.requisicionGuardada.emit( resp );                                   
          resolve(resp.data);       
        }
      });
    });    
  }

  getDato(id:any) {
    return new Promise( resolve => {
        this.http.get(`${URL}/requisiciones/${id}`).subscribe((resp: any) => {  
        if (resp['code'] === 200)  {          
          resolve(resp.data);                         
        }
      })
    })
  }

  buscaRequisicion(id: any) {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/requisicion/${id}`).subscribe((resp: any) => {  
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  actualizarRequisicion(id:string, orden: any) {    
    let productos=orden.variaciones;
    let i=0;
    const formData = new FormData(); 

    for(let key in orden){           
      if (key === 'variaciones') { 
        productos.forEach(element => {
          Object.keys(element).forEach(prop=>{        
            formData.append(prop+[i], element[prop]);             
          }) 
          i++
          formData.append('productosLength', productos.length)
        });
      } 
      formData.append(key, orden[key])
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/requisiciones/${id}`, formData).subscribe( (resp: any) => {        
        this.formSubmitted.emit(false);         
        if (resp['code'] === 200)  {  
          this.requisicionact.emit(1);               
          resolve(resp.data);          
        }
      });
    });  
  }

  borrarRequisicion(id:string){
    return new Promise(resolve =>{
      this.http.delete(`${ URL }/requisiciones/${id}`).subscribe((resp:any)=>{  
        if(resp['code']==200){
          this.requisicionBorrada.emit(id);
          resolve(resp.data);
        }
      })
    })
  }

  busquedaRequisicion(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('requisicion',parametro.requisicion);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/requisicion', {params}).subscribe((resp: any) => { 
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }
}
