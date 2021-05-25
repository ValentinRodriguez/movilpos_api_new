import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ClientesService } from 'src/app/services/clientes.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { TipoClienteService } from 'src/app/services/tipo-cliente.service';
import { TipoNegocioService } from 'src/app/services/tipo-negocio.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StepclientesComponent } from '../stepclientes/stepclientes.component';

@Component({
  selector: 'app-formulario-clientes',
  templateUrl: './formulario-clientes.component.html',
  styleUrls: ['./formulario-clientes.component.scss'],
})
export class FormularioClientesComponent implements OnInit {

  guardando = false;
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
  id1: number;
  condpago: any[];
  paises: any[] = [];
  regiones: any[] = [];
  tipo_proveedor=[];
  actualizando = false;
  formSubmitted = false;
  listSubscribers: any = [];
  items: MenuItem[] = [];
  municipios: any[] = [];
  ciudades: any[] = [];
  sectores: any[] = [];
  sino = [
    { label: 'Si', value:'si'},
    { label: 'No', value:'no'},
  ]

  constructor(private fb: FormBuilder, 
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private clientesServ: ClientesService,     
              private tiponegocioServ: TipoNegocioService,
              private tipoClienteServ: TipoClienteService, 
              private datosEstaticosServ: DatosEstaticosService,        
              private paisesCiudadesServ: PaisesCiudadesService,
              public dialogService: DialogService) {
    this.usuario = this.usuariosServ.getUserLogged()
    this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {    
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

    const observer4$ = this.clientesServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
    })

    const observer3$ = this.clientesServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.formSubmitted = true;   
      this.id = Number(resp);      
       
      this.clientesServ.getdato(resp).then((res: any) => {     
        this.forma.patchValue(res);
        this.forma.get('tipo_documento').setValue(this.documento.find(doc => doc.tipo_documento == res.tipo_documento)); 
        this.forma.get('tipo_cliente').setValue(this.tipo_cliente.find(doc => doc.tipo_cliente == res.tipo_cliente)); 
        this.forma.get('vendedor').setValue(this.vendedor.find(doc => doc.id_numemp == res.vendedor)); 
        this.forma.get('cond_pago').setValue(this.condpago.find(doc => doc.id == res.cond_pago));
        this.forma.get('tipo_negocio').setValue(this.tiponegocio.find(doc => doc.tipo_negocio == res.tipo_negocio)); 
        // this.forma.get('id_pais').setValue(this.paises.find(pais => pais.id_pais === res.id_pais));    
        // this.paisesCiudadesServ.buscaCiudad(res.id_pais).then((resp:any) => { 
        //   this.ciudades = resp;
        //   this.forma.get('id_ciudad').setValue(this.ciudades.find(ciudad => ciudad.id_ciudad === res.id_ciudad));
        // })       
      })
    })

    const observer6$ = this.forma.valueChanges.subscribe(newVal => console.log(newVal));

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$,observer6$];
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
 
           default:
             break;
         }
       });   
       this.autollenado(resp)
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
       this.dialogService.open(StepclientesComponent, {
        data,
        closeOnEscape: false,
        header: 'Datos necesarios creación de clientes',
        width: '70%'
      });  
      // ref.onClose.subscribe(() => {
        //   location.reload();        
        // });
      }
    }
  
  todosLosPaises() {
    this.paisesCiudadesServ.getPaises().then((resp: any)=>{
      console.log(resp);      
      this.paises = resp;   
    })
  }
  
  buscaRegion(event) {
      this.paisesCiudadesServ.buscaRegion(event).then((resp:any) => {  
      this.regiones = resp;
    })   
  }

  buscaMunicipio(event) {
    this.paisesCiudadesServ.buscaMunicipios(event).then((resp:any) => {  
      this.municipios = resp;
    })   
  }
 
  buscaCiudad(event) {
    this.paisesCiudadesServ.buscaCiudad(event).then((resp:any) => {  
      console.log(resp);      
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

      id_pais:              ['', Validators.required],
      id_region:            ['', Validators.required],
      id_municipio:         ['', Validators.required],
      id_ciudad:            ['', Validators.required],
      id_sector:            ['', Validators.required],

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
    // this.formSubmitted = true;    
    console.log(this.forma.value);
         
    if (this.forma.invalid) {
      this.formSubmitted = false;
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios'); 
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{
      this.clientesServ.crearCliente(this.forma.value).then((resp: any)=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');              
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
    this.formSubmitted = true;   
    this.forma.get('usuario_modificador').setValue(this.usuario.username);     
    if (this.forma.invalid) {  
      this.formSubmitted = false;    
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{      
      this.clientesServ.actualizarCliente(this.id, this.forma.value).then((resp: any)=>{    
        this.actualizando=false;
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta'); 
      })
    } 
     
  } 
}
