import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
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
  productosEscogidos= new EventEmitter();
  
  listSubscribers: any = [];

  readonly ProductFull = {
    general: null,
    envio: null,
    atributos: null,
    clasificacion: null,
    enlazados: null
  }

  readonly tiposProducto = {}

  constructor(private http: HttpClient,
              private router: Router) { }
            
  ngOnDestroy() {
    console.log('destruido');    
    this.listSubscribers.forEach(a => {
      if (a !== undefined) {
        a.unsubscribe()        
      }
    });
  }

  getDatosProducto(urlS:string) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/${urlS}`).subscribe((resp: any) =>{
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

  crearProducto(storeProduct) {
    const formData = new FormData(); 
    const imagenes = storeProduct.galeriaImagenes;
    
    for (let key in storeProduct) {
      if (storeProduct[key] !== null) {
        switch (key) {
          case 'galeriaImagenes':          
            for (let i = 0; i < imagenes.length; i++) {
              const imagen = imagenes[i];
              formData.append('imageLength', imagenes.length);
              formData.append(key + i, imagen, imagen.name);
            }
            break;
          
          case 'atributos':
            formData.append(key, JSON.stringify(storeProduct[key]));
            break;
          
          case 'composicion':
            if (storeProduct[key] !== '') {
              const composiciones = []
              storeProduct[key].forEach(element => {
                composiciones.push(element.id);
              });
              formData.append(key, JSON.stringify(composiciones));              
            }
            break;

          default:
            formData.append(key, storeProduct[key]);
            break;
        }        
      }
    }
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${URL}/productos-plaza`,formData).subscribe((resp: any) =>{
        console.log(resp);        
        if (resp['code'] === 200)  {          
          resolve(resp.data);     
          this.productoGuardado.emit(1)       
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

  returnToGeneral() {
    const general = this.getProduct('general')
    console.log(general);
    if (general == null) {
      this.router.navigate(['plaza-online/creacion-productos-plaza/general']);
    }
  }

  tipoProductos(data: any) {
    this.tipoProducto.emit(data);
  }

  createProduct(data, campo) {
    this.ProductFull[campo] = data;
    console.log(this.ProductFull);    
  }

  getProduct(campo) {
    return this.ProductFull[campo]    
  }

  setTipo(data) {
    Object.keys(data).forEach((key) =>{
      this.tiposProducto[key] = data[key];
    })
    console.log(this.tiposProducto);    
  }

  getTipo(campo) {
    return this.tiposProducto[campo]    
  }

  listadoProductosEscogidos(data) {
    this.productosEscogidos.emit(data)
  }
}
