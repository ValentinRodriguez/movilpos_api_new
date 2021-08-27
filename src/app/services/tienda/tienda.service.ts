import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  
  guardar = new EventEmitter();
  productoGuardado= new EventEmitter();
  productoBorrada= new EventEmitter();
  productoAct= new EventEmitter();
  actualizando = new EventEmitter();
  tipoProducto = new EventEmitter();

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
      this.listSubscribers.push(this.http.get(`${URL}/productos-plaza`).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      }))
    })
  }

  getDataCategoria(id:string,url:string) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/${url}/${id}`).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      }))
    })
  }

  crearProducto(data) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${URL}/productos-plaza`,data).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      }))
    })
  }

  actProductosTienda(page: number) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/productos-plaza`).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      }))
    })
  }

  borrarProducto(page: number) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/productos-plaza`).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
            resolve(resp.data);            
        }
      }))
    })
  }

  contarProductosTienda(page: number) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/productos-plaza`).subscribe((resp: any) =>{
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  tipoProductos(data: any) {
    this.tipoProducto.emit(data);
  }

  createProduct(data) {
    console.log(data);    
    // let obj:any = {};
    // for (const property in data) {
    //   // console.log(`${property}: ${data[property]}`);
    //   obj[property] = data[property];
    // }
    // console.log(obj);
    switch (data.step) {
      case 'general':
        localStorage.setItem('general',JSON.stringify(data));        
        break;
    
      case 'clasificacion':
        localStorage.setItem('clasificacion',JSON.stringify(data));        
        break;
      default:
        break;
    }
  }
}
