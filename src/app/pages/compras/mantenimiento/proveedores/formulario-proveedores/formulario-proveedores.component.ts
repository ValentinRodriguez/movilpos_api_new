import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CatalogoCuentasComponent } from 'src/app/components/catalogo-cuentas/catalogo-cuentas.component';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StepProveedoresComponent } from '../step-proveedores/step-proveedores.component';

@Component({
  selector: 'app-formulario-proveedores',
  templateUrl: './formulario-proveedores.component.html',
  styleUrls: ['./formulario-proveedores.component.scss']
})
export class FormularioProveedoresComponent implements OnInit {
  forma: FormGroup;
  usuario:any;
  guardando = false;  
  selectedMulti: any[] = [];
  cuenta_no: any;
  proveedorExiste = 3;
  tipo_proveedor=[];
  documento=[];
  ciudades=[];
  paises=[];
  condpago:any[] = [];
  monedas: any;
  cedula = true;
  rnc = false; 
  cols2:any[]= [];
  cgcatalogos: any[] = [];  
  paisesFiltrados: any[] = [];  
  ciudadesFiltradas: any[] = [];  

  constructor(private fb: FormBuilder, 
              private paisesCiudadesServ: PaisesCiudadesService,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              private proveedoresServ:ProveedoresService,
              private cgCatalogoServ: CgcatalogoService,
              public dialogService: DialogService) { 
      this.usuario = this.usuariosServ.getUserLogged();
      this.crearFormulario() 
  }

  ngOnInit(): void {
    this.todaLaData();
    this.catalogoEscogido();

    this.cols2 = [
      { field: 'descripcion', header: 'Descripción' },
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'origen', header: 'Origen' },
      { field: 'tipo_cuenta', header: 'Tipo Cuenta' },
      { field: 'porciento', header: 'Porciento' },
      { field: 'acciones', header: 'Acciones' },
    ]
    
  }

  catalogoEscogido() {
    this.cgCatalogoServ.catalogoEscogido.subscribe((resp: any) => {
      resp.forEach(element => {
        this.cgcatalogos.push(element);
        this.agregarFormulario(element);
      });               
    })
  }

  todaLaData() {
    this.proveedoresServ.autoLlenado().then((resp: any)  => {
      resp.forEach(element => {
        switch (element.label) {
          case 'condiciones':
            this.condpago = element.data;
            break;

          case 'monedas':
            this.monedas = element.data;
            break;

          case 'catalogo':
            this.cuenta_no = element.data;
            break;  

          case 'tipo proveedor':
            this.tipo_proveedor = element.data;
            break; 

          case 'paises':
            this.paises = element.data;
            console.log(this.paises);
            
            break; 

          case 'tipo documento':
            this.documento = element.data;
            this.forma.get('tipo_doc').setValue(this.documento.find(doc => doc.descripcion === 'cedula'));
            break; 

          default:
            break;
        }
      });  
      this.autollenado(resp);  
    })
  }

  autollenado(data) {
    let existe = null;
    data.forEach(element => {            
      if (element.data.length === 0) {
        existe = true;
      }
    });
    if (existe === true) {
      const ref = this.dialogService.open(StepProveedoresComponent, {
        data,
        closeOnEscape: false,
        header: 'Datos Necesarios Creación Proveedores',
        width: '70%'
      });  
      // ref.onClose.subscribe(() => {
      //   location.reload();        
      // });
    }
  }

  crearFormulario() {
    this.forma = this.fb.group({
      cod_sp:              [''],  
      email:               ['valentinrodriguez1428@gmail.com', Validators.compose([ Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],  
      nom_sp:              ['valentin rodriguez', Validators.required],          
      dir_sp:              ['santo domingo', Validators.required],
      tel_sp:              ['(888)-888-8888', Validators.required],
      fax_sp:              ['(888)-888-8888', Validators.required],          
      cont_sp:             ['adsads', Validators.required],
      tipo_doc:            ['', Validators.required],
      cond_pago:           ['', Validators.required],          
      documento:           ['22500192319'],        
      id_moneda:           ['', Validators.required],        
      cuenta_no:           ['', Validators.required],
      id_pais:             ['', Validators.required],            
      id_ciudad:           ['', Validators.required],          
      usuario_creador:     [this.usuario.username],
      usuario_modificador: [''],
      estado:              ['activo'],
      cuentas_no:          this.fb.array([])
    })
  }

  get producto() {   
    return this.forma.get('cuentas_no') as FormArray;
  }
  
  agregarFormulario(cuentas) {
    (<FormArray>this.forma.get('cuentas_no')).push(this.agregarFormularioTransacciones(cuentas));    
  }
  
  agregarFormularioTransacciones(cuentas): FormGroup {
    return this.fb.group({
      descripcion: [cuentas.descripcion, Validators.required],  
      cuenta_no:   [cuentas.cuenta_no, Validators.required],  
      porciento:   ['', Validators.required],  
    });
  }

  buscaPaises(id) {    
    this.paisesCiudadesServ.getCiudadesXpaises(id).then((resp:any) => {
      this.ciudades = resp;     
    })  
  }

  setValue() {
    this.selectedMulti = this.forma.get("id_moneda").value
  }

  guardarProveedor(){
    //this.guardando = true;           
    if (this.forma.invalid) {      
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.guardando = false;
    }else{      
      this.guardando = false;
      this.proveedoresServ.crearProveedor(this.forma.value).then((resp: any)=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);               
      })
    } 
  } 

  verificaProveedor(data){        
    if (data === "") {
      this.proveedorExiste = 3;
      return;
    }
    let param = {'proveedor': data};
    this.proveedorExiste = 0;
    this.proveedoresServ.busquedaProveedor(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.proveedorExiste = 1;
      }else{
        this.proveedorExiste = 2;
      }
    })
  }

  filtrarPaises(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.paises.length; i++) {
      const size = this.paises[i];
      if (size.descripcion.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.paisesFiltrados = filtered;
  }

  filtrarCiudades(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.ciudades.length; i++) {
      const size = this.ciudades[i];
      if (size.descripcion.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.ciudadesFiltradas = filtered;
  }

  setCuenta(data) {
    this.forma.get('cuenta_no').setValue(data)
  }

  tipoDoc(doc) {
    if (doc.descripcion === 'cedula') {
      this.cedula = true;
      this.rnc = false;
      this.forma.get('rnc').reset()
    } 
    if (doc.descripcion === 'RNC') {
      this.cedula = false;
      this.rnc = true;
      this.forma.get('cedula').reset()
    } 
  }

  buscaCuentas() {
    const ref = this.dialogService.open(CatalogoCuentasComponent, {
      header: 'Catalogo de cuentas',
      width: '50%'
    });
  }

  borrarCatEscogido(id) {    
    this.cgcatalogos.splice(id,1)  
  }

  // FUNCIONES PARA EL MANEJO DE LOS ERRORES EN LOS CAMPOS DEL FORMULARIO
  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
