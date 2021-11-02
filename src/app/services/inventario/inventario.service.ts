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
  
  clearProductfu = new EventEmitter();
  
  construct = '';
  usuario: any;
  params: any;

  listSubscribers: any = [];
  
  constructor(private http: HttpClient) { }

  ngOnDestroy() {  
    this.listSubscribers.forEach(a => {
      if (a !== undefined) a.unsubscribe()  
    });
  }

  busquedaProducto(parametro?: any) {
    let params = new HttpParams();   
    params = params.append('producto',parametro);    
    return this.http.get(URL+'/productos/busqueda', {params})
  }

  autoLlenado() {
    return this.http.get(`${URL}/productos/todo`)
  }

  getDato(id: any) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/productos/${id}`).subscribe((resp: any) => {    
        if (resp['ok']) {
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {
    return this.http.get(`${URL}/productos`);
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
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getMedidas() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/medidas/invproducto`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getPropiedades() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/propiedades/invproducto`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearInvProducto( producto: any ) {    
    console.log(producto);    
    return this.http.post(`${ URL }/productos`, producto);
  }

  actualizarInvProducto( id:any, invProducto: any ) {      
    return this.http.put(`${ URL }/productos/${id}`, invProducto)
  }
  
  borrarInvProducto(id: string) {
    return this.http.delete(`${ URL }/productos/${id}`)
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
        console.log(resp);        
        if (resp['ok']) {
          resolve(resp.data);            
        }
      }))
    })
  }

  listadoProductosEscogidos(productos: any) {
    this.productoEscogido.emit(productos);
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

  ClearProductFU() {
    this.clearProductfu.emit();
  }

}
