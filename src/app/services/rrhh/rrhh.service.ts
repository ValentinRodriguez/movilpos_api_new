import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatosEstaticosService } from '../globales/datos-estaticos.service';
const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RrhhService {

  empleadoEscogido = new EventEmitter();
  empleadoAct = new EventEmitter();
  empleadoCreado = new EventEmitter();
  empleadoBorrado = new EventEmitter();  
  actualizar = new EventEmitter();
  duplicar = new EventEmitter();
  guardar = new EventEmitter();

  listSubscribers: any = [];

  constructor(private http: HttpClient,
              private datosEstaticos: DatosEstaticosService) { }
            
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
      this.listSubscribers.push(this.http.get(`${URL}/noempleados`).subscribe((resp: any) => {        
        if (resp['ok'])  {        
          resolve(resp.data);            
        }
      }))
    })
  }

  getDato(id:number) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/noempleados/${id}`).subscribe((resp: any) => {
        if (resp['ok'])  {        
          resolve(resp.data);            
        }
      }))
    })
  }

  
  getCajeros() {   
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/busqueda/cajeros`).subscribe((resp: any) => {                
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }

  getBancos() {
    return new Promise( resolve => {
        this.listSubscribers.push(this.http.get(`${URL}/bancos`).subscribe((resp: any) => {                        
        if (resp['ok'])  {        
          resolve(resp.data);            
        }
      }))
    })
  }

  autoLlenado() {
    return new Promise( resolve => {
        this.listSubscribers.push(this.http.get(`${URL}/autollenado/empleados`).subscribe((resp: any) => {                         
        if (resp['ok'])  {        
          resolve(resp.data);            
        }
      }))
    })
  }

  buscaVendedores() {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/busqueda/vendedores`).subscribe((resp: any) => {                         
        if (resp['ok'])  { 
          resolve(resp.data);            
        }
      }))
    })
  }

  buscaSupervisores(id:string) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/busqueda/supervisores/${id}`).subscribe((resp: any) => {                            
        if (resp['ok'])  { 
          resolve(resp.data);            
        }
      }))
    })
  }

  busquedaCedula(parametro?: any) {
    let params = new HttpParams();
    params = params.append('cedula',parametro);    
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(URL + '/busqueda/cedula', { params }).subscribe((resp: any) => {                
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }
  
  crearEmpleado(empresa) {
    let formData = {};
    
    for (let key in empresa) {
      if (empresa[key] !== undefined) {
        switch (key) {
          // img_empleado:  
                
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
          // case 'num_emp_supervisor':
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
            
          case 'fecha_entrada':
          case 'fecha_inicio_c':
          case 'fecha_nacimiento':
          case 'fecha_suspencion':
          case 'fecha_termino_contrato':
          case 'fecha_ultimo_aumento':
            if (empresa[key] !== "") {
              formData[key] = this.datosEstaticos.getDataFormated(empresa[key]);              
            }
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
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.post(`${ URL }/noempleados`, formData).subscribe( (resp:any) => {
        if (resp['ok']) {
          this.empleadoCreado.emit(true);
          resolve(resp.data);      
        }
      }))
    });    
  }

  actualizarEmpleado(id,empresa) {
    let formData = {};
    
    for (let key in empresa) {
      if (empresa[key] !== undefined) {
        switch (key) {
          // img_empleado:  
                
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
          // case 'num_emp_supervisor':
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
    }

    return new Promise( resolve => {
      this.listSubscribers.push(this.http.put(`${ URL }/noempleados/${id}`, formData).subscribe( (resp:any) => {
        if (resp['ok']) {
          this.empleadoCreado.emit(true);
          resolve(resp.data);      
        }
      }))
    });    
  }

  empleadoEscogidos(empleado) {
    this.empleadoEscogido.emit(empleado);
  }

  actualizando(data: any) {
    this.actualizar.emit(data);
  }

  duplicando(data: any) {
    this.duplicar.emit(data);
  }

  guardando() {
    this.guardar.emit(0);
  }
}
