import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RrhhService {

  empleadoEscogido = new EventEmitter();
  formSubmitted = new EventEmitter();
  
  constructor(private http: HttpClient) {}

  getDatos() {
    return new Promise( resolve => {
      this.http.get(`${URL}/noempleados`).subscribe((resp: any) => {
        this.formSubmitted.emit(false);
        if (resp['code'] === 200)  {        
          resolve(resp.data);            
        }
      })
    })
  }

  
  getCajeros() {   
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/cajeros`).subscribe((resp: any) => {
        console.log(resp);        
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }

  getBancos() {
    return new Promise( resolve => {
        this.http.get(`${URL}/bancos`).subscribe((resp: any) => {                        
        if (resp['code'] === 200)  {        
          resolve(resp.data);            
        }
      })
    })
  }

  autoLlenado() {
    return new Promise( resolve => {
        this.http.get(`${URL}/autollenado/empleados`).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  {        
          resolve(resp.data);            
        }
      })
    })
  }

  buscaVendedores() {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/vendedores`).subscribe((resp: any) => {                         
        if (resp['code'] === 200)  { 
          resolve(resp.data);            
        }
      })
    })
  }

  buscaSupervisores(id:string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/busqueda/supervisores/${id}`).subscribe((resp: any) => {                            
        if (resp['code'] === 200)  { 
          resolve(resp.data);            
        }
      })
    })
  }

  crearEmpleado(empresa) {
    let formData = {};
    
    for(let key in empresa){        
      switch (key) {
        // foto_empleado:  
              
        case 'cod_cia':
          formData[key] = empresa[key].cod_cia
          break

        case 'departamento':
        case 'codbancodestino':
        case 'cod_puesto':
        case 'cod_nac':
        case 'educacion':
        case 'estado_civil':
        case 'moneda':
        case 'num_emp_supervisor':
        case 'sucid':
        case 'tipo_empleado':
        case 'tipo_sangre':
        case 'cuenta_no':
        case 'id_moneda':
        case 'id_puesto':
        case 'suc_id':
        case 'turno':
        case 'area':
          formData[key] = empresa[key].id;
          break

        case 'retiro_comercial':
          formData[key] = empresa[key].value;
          break

        case 'id_pais':
          formData[key] = empresa[key].id_pais;
          break

        case 'id_region':
          formData[key] = empresa[key].id_region;
          break

        case 'id_provincia':
          formData[key] = empresa[key].id_provincia;
          break

        case 'id_municipio':
          formData[key] = empresa[key].id_municipio;
          break

        case 'id_ciudad':
          formData[key] = empresa[key].id_ciudad;
          break

        case 'id_sector':
          formData[key] = empresa[key].id_sector;
          break

        default:
          formData[key] = empresa[key]
          break;
      }
    }

    return new Promise( resolve => {
      this.http.post(`${ URL }/noempleados`, formData).subscribe( (resp:any) => {
        this.formSubmitted.emit(false);        
        console.log(resp);                           
        if (resp['code'] === 200)  {                                      
          resolve(resp.data);      
        }
      });
    });    
  }

  empleadoEscogidos(empleado) {
    this.empleadoEscogido.emit(empleado);
  }

}
