import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  ClienteCreado = new EventEmitter();
  clienteBorrado = new EventEmitter();
  clientAct      = new EventEmitter();

  actualizar = new EventEmitter();
  guardar = new EventEmitter();

  constructor(private http: HttpClient) {}

  getDatos() {
    return new Promise( resolve => {
        this.http.get(`${URL}/mclientes`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  autollenado() {
    return new Promise( resolve => {
        this.http.get(`${URL}/autollenado/clientes`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }
  
  getdato(id) {
    return new Promise( resolve => {
        this.http.get(`${URL}/mclientes/${id}`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  crearCliente(cliente: any) {
    const formData = new FormData(); 
    
    for(let key in cliente){  
      if (key === 'generico') {
        formData.append(key, cliente[key].value)
      }
      else if (key === 'vendedor') {
        formData.append(key, cliente[key].id_numemp)
      }
      else if (key === 'id_ciudad' || key === 'id_pais' || key === 'tipo_cliente' || key === 'tipo_documento' || key === 'tipo_negocio' || key === 'cond_pago') {
        formData.append(key, cliente[key].id)         
      }
      else{          
        formData.append(key, cliente[key])
      }
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/mclientes`, formData).subscribe( resp => {    
                        
          if (resp['code'] === 200) {    
            this.ClienteCreado.emit( resp );                                   
            resolve(resp);       
          }
      });
    });    
  }

  actualizarCliente(id:number, client: any) {
    return new Promise( resolve => {
      this.http.put(`${ URL }/mclientes/${id}`, client)
              .subscribe( (resp: any) => {   
                   
                if (resp['code'] === 200) {
                  this.clientAct.emit( resp.data );                            
                  resolve(resp);          
                }
              });
    });

  }

  getCiudad() {
    return new Promise( resolve => {
        this.http.get(`${URL}/ciudad`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  getPais() {
    return new Promise( resolve => {
        this.http.get(`${URL}/pais`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  getZonas() {
    return new Promise( resolve => {
        this.http.get(`${URL}/zonas`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  getVendedor() {
    return new Promise( resolve => {
        this.http.get(`${URL}/busqueda/vendedores`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  getDocumento(){
    return new Promise( resolve => {
        this.http.get(`${URL}/documento`).subscribe((resp: any) => {
          if (resp['code'] === 200) {          
            resolve(resp.data);            
          }
      })
    })
  }

  borrarCliente(id:string){
    return new Promise(resolve =>{
      this.http.delete(`${ URL }/mclientes/${id}`)
      .subscribe((resp:any)=>{
        if(resp['code']==200){
          this.clienteBorrado.emit(id);
          resolve(resp);
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
