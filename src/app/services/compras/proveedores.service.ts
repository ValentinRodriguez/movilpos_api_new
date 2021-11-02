import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService implements OnDestroy{
  proveedorEscogido = new EventEmitter;
  proveedoresCreados = new EventEmitter()
  proveeact = new EventEmitter();
  proveedorBorrado = new EventEmitter();
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

  getDatos() {
    return this.http.get(`${URL}/proveedores`)
  }

  autoLlenado() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/autollenado/proveedores`).subscribe((resp: any) => {                               
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  autollenado() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/autollenado/proveedores`).subscribe((resp: any) => {                                
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id: any) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/proveedores/${id}`).subscribe((resp: any) => {                           
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  busquedaProveedor(parametro) {
    let params = new HttpParams();
    params = params.append('proveedor',parametro);    
    return this.http.get(URL+'/proveedores/busqueda', {params})
  }

  crearProveedor(provee: any) {
    console.log(provee);
    
    // for(let key in provee){         
    //   switch (key) {
    //     case 'cod_sp':
    //     case 'cond_pago':
    //     case 'id_ciudad':
    //     case 'id_pais':            
    //       data[key] = provee[key].id;          
    //     break;

    //     case 'tipo_doc':            
    //         data[key] = provee[key].tipo_documento;          
    //     break;
    
    //     case 'id_moneda':            
    //       data[key] = JSON.stringify(provee[key]);
    //     break;

    //     default:
    //       data[key] = provee[key]
    //       break;
    //   }
    // }

    return this.http.post(`${ URL }/proveedores`, provee)    
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
      this.listSubscribers.push(this.http.put(`${ URL }/proveedores/${id}`, data).subscribe( (resp: any) => {   
        if (resp['ok'])  {
          this.proveeact.emit( resp.data );                            
          resolve(resp.data);                               
        }
      }))
    });
  }

  borrarProveedor(id:string){
    return this.http.delete(`${ URL }/proveedores/${id}`)
  }

  reporteCatalogoProveedores(provee: any) {    
    let data = {}
    for(let key in provee){         
      switch (key) {
        case 'cod_sp':
        case 'cond_pago':
        case 'id_ciudad':
        case 'id_pais':            
          data[key] = provee[key].id  || "";          
        break;

        case 'tipo_doc':            
            data[key] = provee[key].tipo_documento || "";          
        break;
    
        case 'id_moneda':    
          if (provee[key] === "") {
            data[key] = provee[key];               
          }else{
            data[key] = JSON.stringify(provee[key])              
          }        
        break;

        default:
          data[key] = provee[key]
          break;
      }
    }       
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/proveedores/catalogo`, data).subscribe( (resp: any) => {
        if (resp['ok'])  {    
          this.proveedoresCreados.emit( resp.data );                                   
          resolve(resp.data);       
        }
      }))
    }); 
  }

  actualizando(data) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
    
  listadoProveedoresEscogidos(proveedores: any) {
    this.proveedorEscogido.emit(proveedores);
  }
}
