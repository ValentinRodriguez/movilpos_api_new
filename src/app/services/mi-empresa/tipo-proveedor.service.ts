import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TipoProveedorService {

  tipoPguardado = new EventEmitter();
  tipoPborrado = new EventEmitter();
  tipoPact = new EventEmitter();
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

  busquedaTproveedor(parametro?: any) {
    let params = new HttpParams();
    if (parametro === undefined) {
      parametro = {};
    }
    if (parametro.parametro === undefined || parametro.parametro === null) {
      parametro.parametro = '';
    }     
    params = params.append('tipo',parametro.tipo);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL+'/busqueda/tipo-proveedor', {params}).subscribe((resp: any) => {                                     
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDatos() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/tipo-proveedores`).subscribe((resp: any) => {
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id) {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/tipo-proveedores/${id}`).subscribe((resp: any) => {                       
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  crearTproveedor(tipo: any) {
    return new Promise( resolve => {
      const formData = new FormData();
      for(let key in tipo){  
        if (key === 'cuenta_no') {
          formData.append(key, tipo[key].cuenta_no);
        }else{
          formData.append(key, tipo[key]);
        }
      }
      this.listSubscribers.push(this.http.post(`${ URL }/tipo-proveedores`, formData).subscribe( (resp: any) => {  
        if (resp['ok'])  {                                      
          resolve(resp.data);    
          this.tipoPguardado.emit(resp.data);       
        }
      }))
    });    
  }

  actualizarProveedor(id:number, tipo: any) {  
    return new Promise( resolve => {
      let formdata:any = {};    

      for(let key in tipo){  
        if (key === 'cuenta_no') {
          formdata[key] = tipo[key].cuenta_no;
        }else{
          formdata[key] = tipo[key]
        }
      }
      
      this.listSubscribers.push(this.http.put(`${ URL }/tipo-proveedores/${id}`, formdata).subscribe( (resp: any) => {                                     
        if (resp['ok'])  {
          this.tipoPact.emit( resp.data );                            
          resolve(resp.data);            
        }
      }))
    });
  }

  borrarTproveedor(id: string) {
    return new Promise( resolve => {      
      this.listSubscribers.push(this.http.delete(`${ URL }/tipo-proveedores/${id}`).subscribe( (resp: any) => {               
        if (resp['ok'])  {            
          this.tipoPborrado.emit(id);    
          resolve(resp.data);            
        }
      }))
    });
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
