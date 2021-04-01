import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  proveedorEscogido = new EventEmitter;
  proveedoresCreados = new EventEmitter()
  proveeact = new EventEmitter();
  proveedorBorrado = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();

  constructor(private http: HttpClient) {}

  getDatos() {
    return new Promise( resolve => {
        this.http.get(`${URL}/proveedores`).subscribe((resp: any) => {        
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  autoLlenado() {
    return new Promise( resolve => {
        this.http.get(`${URL}/autollenado/proveedores`).subscribe((resp: any) => {        
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  autollenado() {
    return new Promise( resolve => {
        this.http.get(`${URL}/autollenado/proveedores`).subscribe((resp: any) => {        
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  getDato(id: any) {
    return new Promise( resolve => {
      this.http.get(`${URL}/proveedores/${id}`).subscribe((resp: any) => { 
         
               
        if (resp['code'] === 200) {          
          resolve(resp.data);            
        }
      })
    })
  }

  busquedaProveedor(parametro) {
   let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('proveedor',parametro.proveedor);    
    return new Promise( resolve => {
      this.http.get(URL+'/busqueda/proveedores', {params}).subscribe((resp: any) => { 
         
        
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
        })
    })
  }

  listadoProveedoresEscogidos(proveedores: any) {
    this.proveedorEscogido.emit(proveedores);
  }

  crearProveedor(provee: any) {
    let data = {}
      for(let key in provee){         
        switch (key) {
          case 'cod_sp':
          case 'cond_pago':
          case 'id_ciudad':
          case 'id_pais':            
            data[key] = provee[key].id;          
          break;

          case 'tipo_doc':            
              data[key] = provee[key].tipo_documento;          
          break;
      
          case 'id_moneda':            
            data[key] = JSON.stringify(provee[key]);
          break;

          default:
            data[key] = provee[key]
            break;
        }
      }
       
      
      return new Promise( resolve => {
        this.http.post(`${ URL }/proveedores`, data).subscribe( (resp: any) => {  
            console.log(resp);
                                       
            if (resp['code'] === 200) {    
              this.proveedoresCreados.emit( resp.data );                                   
              resolve(resp.data);       
            }
        });
      });    
  }

  actualizarProveedor(id:string, provee: any) {
    let data = {}
    for(let key in provee){         
      switch (key) {
        case 'cod_sp':
        case 'cond_pago':
        case 'id_ciudad':
        case 'id_pais':            
          data[key] = provee[key].id;          
        break;

        case 'tipo_doc':            
            data[key] = provee[key].tipo_documento;          
        break;
    
        case 'id_moneda':            
          data[key] = JSON.stringify(provee[key]);
        break;

        default:
          data[key] = provee[key]
          break;
      }
    }
    
    return new Promise( resolve => {      
      this.http.put(`${ URL }/proveedores/${id}`, data)
              .subscribe( (resp: any) => {     
                if (resp['code'] === 200) {
                  this.proveeact.emit( resp.data );                            
                  resolve(resp);                               
                }
              });
    });
  }

  borrarProveedor(id:string){
    return new Promise(resolve =>{
      this.http.delete(`${ URL }/proveedores/${id}`)
      .subscribe((resp:any)=>{
        if(resp['code']==200){
          this.proveedorBorrado.emit(id);
          resolve(resp);
        }
      })
    })
  }

  actualizando(cod_sp:number, cod_sp_sec:number) {
    const data = [cod_sp, cod_sp_sec]
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
    
}
