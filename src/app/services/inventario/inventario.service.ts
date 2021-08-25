import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const URL = environment.url;
const URLAPI = environment.urlApi;

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  productoGuardado = new EventEmitter();
  productoBorrado = new EventEmitter();
  productoActualizado = new EventEmitter();
  productoEscogido = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  finalizar = new EventEmitter();
  enviarImagen= new EventEmitter(); 
  
  construct = '';
  usuario: any;
  params: any;

  listSubscribers: any = [];
  
  constructor(private http: HttpClient) { }

  ngOnDestroy() {  
    this.listSubscribers.forEach(a => {
      if (a !== undefined) {
        a.unsubscribe()        
      }
    });
  }

  busquedaProducto(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('producto',parametro.producto);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/invproducto', {params}).subscribe((resp: any) => { 
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  busquedaProductoSinExistencia(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('producto',parametro.producto);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/invproducto', {params}).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id: any) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/invproductos/${id}`).subscribe((resp: any) => {    
        if (resp['code'] === 200) {
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/invproductos`).subscribe((resp: any) => { 
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getChasis(chasis) {
    return new Promise( resolve => {  
      const headers = new HttpHeaders({
        "x-rapidapi-key":"2c9e85a058mshf1042b431dadc78p1f24fajsn64bcd991b70b",
        "x-rapidapi-host":"vindecoder.p.rapidapi.com"
      });      
      this.listSubscribers.push(this.http.get(`${URLAPI}${chasis}`,{headers}).subscribe((resp: any) => {
        if (resp.success) {
          resolve(resp.specification);
        }
      }))
    })
  }

  getTipoProducto() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/tipo/invproducto`).subscribe((resp: any) => {
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getMedidas() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/medidas/invproducto`).subscribe((resp: any) => {
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getPropiedades() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/propiedades/invproducto`).subscribe((resp: any) => {
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  autoLlenado() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/autollenado/invproducto`).subscribe((resp: any) => {                                        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearInvProducto( invProducto: any ) {    
    const formData = new FormData();     
    for(let key in invProducto){ 
      switch (key) {

        case 'fabricacion':
          formData.append(key, invProducto[key].value || '');
          break;

        case 'id_bodega':
          formData.append(key, invProducto[key].id_bodega);
          break;

        case 'id_brand':
          formData.append(key, invProducto[key].id_brand);
          break;

        case 'id_categoria':
          formData.append(key, invProducto[key].id_categoria);
          break;

        case 'id_tipoinventario':
          formData.append(key, invProducto[key].id_tipoinventario);
          break;

        case 'id_propiedad':
          formData.append(key, invProducto[key].id_propiedad);
          break;

        case 'tipo_producto':
          formData.append(key, invProducto[key].id_tipo);
          break;

        case 'unidadMed':
          formData.append(key, invProducto[key].id);
          break;

        default:
          formData.append(key, invProducto[key]);
          break;
      }     
    }
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/invproductos`, formData).subscribe((resp: any) => {
        if (resp['code'] === 200)  {
          this.productoGuardado.emit(resp.data);                            
          resolve(resp.data);            
        }
      }))
    });
  }

  actualizarInvProducto( id:any, invProducto: any ) {  
    const formData = new FormData(); 
    for(let key in invProducto){ 
      switch (key) {
        case 'fabricacion':
          formData.append(key, invProducto[key].value);
          break;

        case 'id_bodega':
          formData.append(key, invProducto[key].id_bodega);
          break;

        case 'id_brand':
          formData.append(key, invProducto[key].id_brand);
          break;

        case 'id_categoria':
          formData.append(key, invProducto[key].id_categoria);
          break;

        case 'id_tipoinventario':
          formData.append(key, invProducto[key].id_tipoinventario);
          break;

        case 'id_propiedad':
          formData.append(key, invProducto[key].id_propiedad);
          break;

        case 'tipo_producto':
          formData.append(key, invProducto[key].id_tipo);
          break;

        case 'unidadMed':
          formData.append(key, invProducto[key].id);
          break;

        default: 
          formData.append(key, invProducto[key]);
          break;
      }     
    }
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/act/productos/${id}`, formData).subscribe((resp: any) => {
        if (resp['code'] === 200)  {
          this.productoActualizado.emit( resp );                            
          resolve(resp.data);            
        }
      }))
    });
  }
  
  usuarioEditando( invProducto: any, todo: string, user: any ) { 
    invProducto.usuario_editando = user
    invProducto.editando = todo
      
    const formDataAct = new FormData();

    for(let key in invProducto){ 
      formDataAct.append(key, invProducto[key])
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/invproductos/${invProducto.id}`, invProducto).subscribe( (resp: any) => {                 
        if (resp['code'] === 200)  {                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarInvProducto(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/invproductos/${id}`).subscribe( (resp: any) => {
        if (resp['code'] === 200)  {            
          this.productoBorrado.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }

  repCatalogoProductos(parametro) {    
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    } 

    Object.keys(parametro).forEach(element => {
      switch (element) {
        case 'id_categoria':
          this.params = new HttpParams().append('id_categoria',parametro.id_categoria);     
          break;

        case 'id_tipoinventario':
          this.params = new HttpParams().append('id_tipoinventario',parametro.id_tipoinventario);
          break;

        case 'id_brand':
          this.params = new HttpParams().append('id_brand',parametro.id_brand);
          break;

        case 'descripcion':
          this.params = new HttpParams().append('descripcion',parametro.descripcion);
          break;

        case 'codigo':
          this.params = new HttpParams().append('codigo',parametro.codigo);
          break;

        default:
          break;
      }
    });
    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/reportinv/invcatalogo', this.params).subscribe((resp: any) => {                      
        if (resp['code'] === 200)  {  
          resolve(resp.specification);            
        }
      }))
    })
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
  
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
  
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  listadoProductosEscogidos(productos: any) {
    this.productoEscogido.emit(productos);
  }
  
  actualizando(data: any) {
    this.actualizar.emit(data);
  }
  
  enviarUrlImagenes(data: any) {
    this.enviarImagen.emit(data);
  }
  
  guardando() {
    this.guardar.emit(0);
  }

  finalizando() {
    this.finalizar.emit(1);
  }

}
