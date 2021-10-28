import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class OrdenPedidosService {
  ordenAct = new EventEmitter();
  ordenCreada = new EventEmitter();
  ordenBorrada = new EventEmitter();
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
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/ordenespedidos`).subscribe((resp: any) => {                                              
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id:number) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/ordenespedidos/${id}`).subscribe((resp: any) => {          
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  buscaOrdenPedido(id: any) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/busqueda/orden-pedido/${id}`).subscribe((resp: any) => {                        
        if (resp['ok'])  {          
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
          formData.append('archivosLength', archivos.length)          
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

        case 'cliente':
        case 'id_zonalocal':
        case 'cond_pago':
        case 'id_ciudad':
        case 'id_pais':
          formData.append(key, orden[key].id)          
        break;
        
        case 'tipo_orden':
          formData.append(key, orden[key].value)
        break;

        case 'sec_vend':
          formData.append(key, orden[key].id)
        break;  

        default:
          formData.append(key, orden[key])
        break;
      }
    }
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/ordenespedidos`, formData).subscribe( (resp: any) => {
        if (resp['ok'])  {    
          this.ordenCreada.emit( resp );                                   
          resolve(resp.data);       
        }
      }))
    });    
  }

  actualizarPedido(id:number, categoria: any) {        
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/categorias/${id}`, categoria).subscribe( (resp: any) => {
        if (resp['ok'])  {                  
          this.ordenAct.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarOrden(id:string){
    return new Promise(resolve =>{
      this.listSubscribers.push(this.http.delete(`${ URL }/ordenespedidos/${id}`).subscribe((resp:any)=>{                         
        if(resp['code']==200){
          this.ordenBorrada.emit(id);
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
