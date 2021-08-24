import { environment } from 'src/environments/environment';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class OrdenescomprasService implements OnDestroy {
  
  ordenact = new EventEmitter();
  ordenGuardada= new EventEmitter();
  ordenBorrada = new EventEmitter();
  
  finalizar = new EventEmitter();
  
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
      this.listSubscribers.push(this.http.get(`${URL}/ordenescompras`).subscribe((resp: any) => {                                    
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
     }))
    })
  }

  autoLlenado() {
    return new Promise( resolve => {
        this.listSubscribers.push(this.http.get(`${URL}/autollenado/ordenescompras`).subscribe((resp: any) => {                                      
          if (resp['code'] === 200)  {          
            resolve(resp.data);            
          }
      }))
    })
  }

  crearOrdenes(orden: any) {
    let productos = orden.productos;
    let archivos = orden.archivos;
    let i = 0;
    const formData = new FormData(); 
    for(let key in orden){   
      switch (key) {
        case 'archivos':
          for (let i = 0; i < archivos.length; i++) {           
            formData.append('archivos'+[i], archivos[i], archivos[i].name );
          }        
          formData.append('archivosLength', archivos.length);
        break;

        case 'productos':
          productos.forEach(element => {
            Object.keys(element).forEach(prop=>{        
              formData.append(prop+[i], element[prop]);             
            }) 
            i++
            formData.append('productosLength', productos.length);
          });
        break;

        case 'cond_pago':
        case 'id_puerto':
        case 'via_envio':
        case 'id_moneda':            
          formData.append(key, orden[key].id);
        break;

        default:
          formData.append(key, orden[key]);
        break;
      }
    }
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/ordenescompras`, formData).subscribe( (resp: any) => {
        if (resp['code'] === 200)  {    
          this.ordenGuardada.emit( resp );                                   
          resolve(resp.data);       
        }
      }))
    });    
  }

  getDato(id:any) {
    return new Promise( resolve => {
        this.listSubscribers.push(this.http.get(`${URL}/ordenescompras/${id}`).subscribe((resp: any) => {
        if (resp['code'] === 200)  {          
          resolve(resp.data);                         
        }
      }))
    })
  }

  buscaOrdenCompra(id: any) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/busqueda/ordenescompras/${id}`).subscribe((resp: any) => {
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  actualizarOrden(id:string, orden: any) {
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
      this.listSubscribers.push(this.http.post(`${ URL }/actualizarcompras/${id}`, formData).subscribe( (resp: any) => {
        if (resp['code'] === 200)  {   
          this.ordenact.emit(1);
          resolve(resp.data);          
        }
      }))
    });  
  }

  borrar(id:string){
    return new Promise(resolve =>{
      this.listSubscribers.push(this.http.delete(`${ URL }/ordenescompras/${id}`).subscribe((resp:any)=>{
        if(resp['code']==200){
          this.ordenBorrada.emit(id);
          resolve(resp.data);
        }
      }))
    })
  }

  busquedaOrden(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('orden',parametro.orden);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/categoria', {params}).subscribe((resp: any) => { 
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  finalizando() {
    this.finalizar.emit(1);
  }
}
