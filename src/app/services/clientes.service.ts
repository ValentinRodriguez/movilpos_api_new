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
  formSubmitted = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  finalizar = new EventEmitter();

  constructor(private http: HttpClient) {}

  getDatos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/mclientes`).subscribe((resp: any) => {                       
      if (resp['code'] === 200)  {          
        resolve(resp.data);            
      }
      })
    })
  }

  autollenado() {
    return new Promise( resolve => {
      this.http.get(`${URL}/autollenado/clientes`).subscribe((resp: any) => {                   
      if (resp['code'] === 200)  {          
        resolve(resp.data);            
      }
      })
    })
  }
  
  getdato(id) {
    return new Promise( resolve => {
        this.http.get(`${URL}/mclientes/${id}`).subscribe((resp: any) => {                        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  crearCliente(cliente: any) {
    const formData = new FormData(); 
    
    for(let key in cliente){  
      switch (key) {
        case 'generico':
          formData.append(key, cliente[key].value)
          break;

        case 'vendedor':
          formData.append(key, cliente[key].id_numemp)
          break;

        case 'tipo_cliente':
          formData.append(key, cliente[key].tipo_cliente)
          break;

        case 'tipo_negocio':
          formData.append(key, cliente[key].tipo_negocio)
          break;

        case 'cond_pago':        
        case 'id_ciudad':
        case 'id_pais':
        case 'id_region':
        case 'id_municipio':
        case 'id_sector':
          formData.append(key, cliente[key].id || null)
          break;
        
        case 'tipo_documento':
          formData.append(key, cliente[key].tipo_documento)
          break;

        default:
          formData.append(key, cliente[key])
          break;
      }
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/mclientes`, formData).subscribe( (resp: any) => {  
        console.log(resp)  
        this.formSubmitted.emit(false);                           
        if (resp['code'] === 200)  {    
          this.ClienteCreado.emit( resp.data );                                   
          resolve(resp.data);       
        }
      });
    });    
  }

  actualizarCliente(id:number, client: any) {
    let data = {}
    for(let key in client){         
      switch (key) {
        case 'tipo_cliente':
          data[key] = client[key].tipo_cliente;          
          break;
        case 'cond_pago':
          data[key] = client[key].cond_pago;          
          break;
        case 'id_ciudad':
          data[key] = client[key].id_ciudad;          
          break;
        case 'id_pais':            
          data[key] = client[key].id;          
          break;

        case 'tipo_documento':            
          data[key] = client[key].tipo_documento;          
          break;

        case 'vendedor':            
         data[key] = client[key].id_numemp;          
         break;

        case 'tipo_negocio':            
          data[key] = client[key].tipo_negocio;          
          break;

        default:
          data[key] = client[key]
          break;
      }
    }
    return new Promise( resolve => {
      this.http.put(`${ URL }/mclientes/${id}`, client).subscribe( (resp: any) => {  
        this.formSubmitted.emit(false);                           
        if (resp['code'] === 200)  {
          this.clientAct.emit( resp.data );                            
          resolve(resp.data);          
        }
      });
    });
  }

  getCiudad() {
    return new Promise( resolve => {
      this.http.get(`${URL}/ciudad`).subscribe((resp: any) => {                          
      if (resp['code'] === 200)  {          
        resolve(resp.data);            
      }
      })
    })
  }

  getPais() {
    return new Promise( resolve => {
      this.http.get(`${URL}/pais`).subscribe((resp: any) => {                       
      if (resp['code'] === 200)  {          
        resolve(resp.data);            
      }
      })
    })
  }

  getZonas() {
    return new Promise( resolve => {
      this.http.get(`${URL}/zonas`).subscribe((resp: any) => {
      this.formSubmitted.emit(false);                           
      if (resp['code'] === 200)  {          
        resolve(resp.data);            
      }
      })
    })
  }

  getVendedor() {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/vendedores`).subscribe((resp: any) => {                         
      if (resp['code'] === 200)  {          
        resolve(resp.data);            
      }
      })
    })
  }

  getDocumento(){
    return new Promise( resolve => {
      this.http.get(`${URL}/documento`).subscribe((resp: any) => {                         
      if (resp['code'] === 200)  {          
        resolve(resp.data);            
      }
      })
    })
  }

  borrarCliente(id:string){
    return new Promise(resolve =>{
      this.http.delete(`${ URL }/mclientes/${id}`).subscribe((resp:any)=>{
        if(resp['code']==200){
          this.clienteBorrado.emit(id);
          resolve(resp.data);
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

  finalizando() {
    this.finalizar.emit(1);
  }

}
