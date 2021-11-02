import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CgcatalogoService {

  catalogoActualizado = new EventEmitter();
  catalogoBorrado = new EventEmitter();
  catalogoEscogido = new EventEmitter();
  catalogoGuardado = new EventEmitter();
  actualizar = new EventEmitter();
  guardar = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  busqueda(parametro?: any) {
    let params = new HttpParams(); 
    params = params.append('descripcion',parametro);  
    return this.http.get(`${URL}/cuentas/busqueda`,{params})
  }

  busquedaCatalogo(parametro) {
    let params = new HttpParams();    
    params = params.append('cuenta_no',parametro);    
    return this.http.get(URL+'/cuentas/busqueda-cuenta', {params})
  }

  getDatos() {
    return this.http.get(`${URL}/cuentas`)    
  }

  getDatosAux() {
    return this.http.get(`${URL}/cuentas/cuentas-auxiliares`)
  }

  // codigosRetencion() {
  //   return this.http.get(`${URL}/codigos-retencion`)
  // }

  getDato(id: any) {
    return this.http.get(`${URL}/cuentas/${id}`)
  }

  crearCgcatalogos(cgcatalogo: any) {
    if (cgcatalogo.aplica_a === undefined) {
      cgcatalogo.aplica_a = cgcatalogo.cuenta_no;
    }
    
    for(let key in cgcatalogo){  
      switch (key) {
        case 'analitico':
        case 'catalogo':
        case 'depto':
        case 'referencia':
        case 'retencion':
        case 'tipo_cuenta':   
        case 'nivel':
        case 'grupo':
        case 'origen':
        case 'selectivo_consumo':
          cgcatalogo[key] = cgcatalogo[key].value
          break;

        case 'cuenta_resultado':
          if (cgcatalogo[key] === true) {
            cgcatalogo[key] = 'si'
          } else {
            cgcatalogo[key] = 'no'
          }
          break;

        case 'codigo_isr':
          cgcatalogo[key] = cgcatalogo[key].id
          break;

        default:
          // cgcatalogo[key] = cgcatalogo[key]
          break;
      }      
    }
    console.log(cgcatalogo);
    
    return this.http.post(`${ URL }/cuentas`, cgcatalogo)
  }

  actualizarCatalogo(id:string, cgcatalogo: any) {  
   console.log(cgcatalogo);
   
    if (cgcatalogo.aplica_a === undefined) {
      cgcatalogo.aplica_a = cgcatalogo.cuenta_no;
    }

    for(let key in cgcatalogo){  
      switch (key) {
        case 'analitico':
        case 'catalogo':
        case 'depto':
        case 'referencia':
        case 'retencion':
        case 'tipo_cuenta':   
        case 'nivel':
        case 'grupo':
        case 'origen':
        case 'selectivo_consumo':          
          cgcatalogo[key] = cgcatalogo[key].value
          break;

        case 'cuenta_resultado':
          if (cgcatalogo[key] === true) {
            cgcatalogo[key] = 'si';
          } else {
            cgcatalogo[key] = 'no';
          }
          break;

        case 'codigo_isr':
          cgcatalogo[key] =cgcatalogo[key].id
          break;

        default:
          cgcatalogo[key] =cgcatalogo[key]
          break;
      }      
    }
      
    return this.http.put(`${ URL }/cuentas/${id}`, cgcatalogo)
  }

  borrarCatalogo(id: string) {
    return this.http.delete(`${ URL }/cuentas/${id}`)
  }

  listadocatalogoEscogidos(data: any) {
    this.catalogoEscogido.emit(data);
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}


