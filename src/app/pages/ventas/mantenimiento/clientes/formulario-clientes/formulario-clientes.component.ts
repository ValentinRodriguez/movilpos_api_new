import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ClientesService } from 'src/app/services/clientes.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { TipoClienteService } from 'src/app/services/mi-empresa/tipo-cliente.service';
import { TipoNegocioService } from 'src/app/services/mi-empresa/tipo-negocio.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';
@Component({
  selector: 'app-formulario-clientes',
  templateUrl: './formulario-clientes.component.html',
  styleUrls: ['./formulario-clientes.component.scss'],
})
export class FormularioClientesComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  documento=[];
  zona=[];
  tiponegocio=[];
  tipo_cliente=[];
  vendedor=[];
  id: number;
  cedula = true;
  rnc = false;
  pasaporte = false;
  guardar = true;
  actualizar = false;
  vendedoresFiltrados: any[];
  nacFiltrados: any[];
  id1: number;
  condpago: any[];
  paises: any[] = [];
  regiones: any[] = [];
  tipo_proveedor=[];
  
  listSubscribers: any = [];
  items: MenuItem[] = [];
  municipios: any[] = [];
  ciudades: any[] = [];
  sectores: any[] = [];
  sino = [
    { label: 'Si', value:'si'},
    { label: 'No', value:'no'},
  ]
  provincias: any[] = [];
  nacionalidades: any[] = [];
  rutaActual: string[];

  constructor(private globalFunction: GlobalFunctionsService,private fb: FormBuilder, 
              public router: Router,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private clientesServ: ClientesService,     
              private tiponegocioServ: TipoNegocioService,
              private tipoClienteServ: TipoClienteService, 
              private datosEstaticosServ: DatosEstaticosService,        
              private paisesCiudadesServ: PaisesCiudadesService,
              public dialogService: DialogService,
              private globalServ: GlobalFunctionsService,
              @Inject(DOCUMENT) private document: Document) {
    this.usuario = this.usuariosServ.getUserLogged()
    this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {    
    this.rutaActual = this.router.url.split("/");
    console.log(this.rutaActual);
    
    this.todosLosPaises();
    this.listObserver();
    this.autoLlenado(); 
  }

  listObserver = () => {
    const observer1$ = this.tiponegocioServ.tipoNegocioguardado.subscribe((resp: any) => {
      this.tiponegocio.push(resp);
    })

    const observer2$ = this.tipoClienteServ.tipoClienteguardado.subscribe((resp: any) => {
      this.tipo_cliente.push(resp);                                                                                               
    })

    const observer3$ = this.clientesServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
         
      this.id = Number(resp);      
       
      this.clientesServ.getdato(resp).then((res: any) => {     
        this.forma.patchValue(res);
        this.forma.get('tipo_documento').setValue(this.documento.find(doc => doc.tipo_documento == res.tipo_documento)); 
        this.forma.get('tipo_cliente').setValue(this.tipo_cliente.find(doc => doc.tipo_cliente == res.tipo_cliente)); 
        this.forma.get('vendedor').setValue(this.vendedor.find(doc => doc.id == res.vendedor)); 
        this.forma.get('cond_pago').setValue(this.condpago.find(doc => doc.id == res.cond_pago));
        this.forma.get('tipo_negocio').setValue(this.tiponegocio.find(doc => doc.tipo_negocio == res.tipo_negocio)); 
        // this.forma.get('id_pais').setValue(this.paises.find(pais => pais.id_pais === res.id_pais));    
        // this.paisesCiudadesServ.buscaCiudad(res.id_pais).then((resp:any) => { 
        //   this.ciudades = resp;
        //   this.forma.get('id_ciudad').setValue(this.ciudades.find(ciudad => ciudad.id_ciudad === res.id_ciudad));
        // })       
      })
    })

    const observer5$ = this.globalServ.finalizar.subscribe((resp: any) =>{      
      this.items = [];
    })

    this.listSubscribers = [observer1$,observer2$,observer3$];
  };

  autoLlenado() {
    this.clientesServ.autollenado().then((resp: any) => {
      resp.forEach(element => {
        if (element.data.length === 0) {
          this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(element.label), routerLink: element.label})      
        }
        switch (element.label) {
          case 'vendedor':
            this.vendedor = element.data;
            break;

          case 'tipo documento':
            this.documento = element.data;
            break;

          case 'tipo-negocio':
            this.tiponegocio = element.data;
            break;

          case 'tipo-cliente':
            this.tipo_cliente = element.data;
            break;

          case 'condiciones':
            this.condpago = element.data;
            break;
          
        case 'paises':
          this.paises = element.data;
            break;
          
          case 'nacionalidades':             
            this.nacionalidades = element.data;             
          break;

          default:
            break;
        }
      });   
    })
  }

  todosLosPaises() {
    this.paisesCiudadesServ.getPaises().then((resp: any)=>{      
      this.paises = resp;   
    })
  }
  
  buscaRegion(event) {
      this.paisesCiudadesServ.buscaRegion(event).then((resp:any) => {  
      this.regiones = resp;
    })   
  }

  buscaProvincia(event) {
      this.paisesCiudadesServ.buscaProvincias(event).then((resp:any) => {  
      this.provincias = resp;
    })   
  }

  buscaMunicipio(event) {
    this.paisesCiudadesServ.buscaMunicipios(event).then((resp:any) => {  
      this.municipios = resp;
    })   
  }
 
  buscaCiudad(event) {
    this.paisesCiudadesServ.buscaCiudad(event).then((resp:any) => { 
      this.ciudades = resp;
    })   
  }

  buscaSector(event) {
    this.paisesCiudadesServ.buscaSector(event).then((resp:any) => {  
      this.sectores = resp;
    })   
  }

  crearFormulario() {
    this.forma = this.fb.group({
      nombre:               ['joselito perez', Validators.required],
      tipo_documento:       ['', Validators.required],
      vendedor:             ['', Validators.required],
      documento:            [''],
      limite_credito:       [''],
      tipo_negocio:         ['', Validators.required],
      ncf:                  ['B0100066853'],
      generico:             ['', Validators.required],      
      direccion:            ['santo domingo', Validators.required],
      urbanizacion:         ['dfgdfg', Validators.required],
      nacionalidad:         ['', Validators.required],
      id_pais:              ['', Validators.required],
      id_zona:              [''],
      id_region:            ['', Validators.required],
      id_provincia:         ['', Validators.required],
      id_municipio:         ['', Validators.required],
      id_ciudad:            [''],
      id_sector:            [''],
      calle:                [''],
      celular:              ['(555)-555-5555', Validators.required],
      telefono_casa:        ['(555)-555-5555'],
      email:                ['valentinrodriguez1427@gmail.com'],      
      tipo_cliente:         ['', Validators.required],
      cond_pago:            ['', Validators.required],
      telefono_oficina:     ['(555)-555-5555'],
      url:                  ['ddgfdfg.com'],
      contacto:             ['luis miguel'],
      estado:               ['activo'],
      usuario_creador:      [this.usuario.username],
      usuario_modificador:  ['']
    })
  }

  guardarCliente(){
      
    console.log(this.forma.value);    
    if (this.forma.invalid) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios'); 
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{
      this.clientesServ.crearCliente(this.forma.value).then((resp: any)=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');              
        this.resetFormulario();
      })
    }       
  } 

  filtrarVendedores(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.vendedor.length; i++) {
      const size = this.vendedor[i];
      if (size.primernombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.vendedoresFiltrados = filtered;
  }

  filtrarNacionalidad(event) {
    const filtered: any[] = [];
    const query = event.query;    
    
    for (let i = 0; i < this.nacionalidades.length; i++) {
      const size = this.nacionalidades[i];
      if (size.nacionalidad.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.nacFiltrados = filtered;
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

  tipoDoc(doc) {
    if (doc === 'cedula') {
      this.cedula = true;
      this.rnc = false;
      this.pasaporte = false;
    } 
    if (doc === 'RNC') {
      this.cedula = false;
      this.rnc = true;
      this.pasaporte = false;
    } 
    if (doc === 'pasaporte') {
      this.cedula = false;
      this.rnc = false;
      this.pasaporte = true;
    } 
  }
  
  actualizarCliente() {
       
    this.forma.get('usuario_modificador').setValue(this.usuario.username);     
    if (this.forma.invalid) {  
          
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{      
      this.clientesServ.actualizarCliente(this.id, this.forma.value).then(()=>{    
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta'); 
        this.resetFormulario();
      })
    }
  } 

  redirigir() {
    const link = this.document.createElement('a');
    link.target = '_blank';
    link.href = `http://localhost:4200/#/ventas/clientes`;
    link.click();
    link.remove();
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }
}
