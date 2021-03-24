import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ClientesService } from 'src/app/services/clientes.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StepclientesComponent } from '../stepclientes/stepclientes.component';

@Component({
  selector: 'app-formulario-clientes',
  templateUrl: './formulario-clientes.component.html',
  styleUrls: ['./formulario-clientes.component.scss']
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
  cedula = true;
  rnc = false;
  vendedoresFiltrados: any[];
  condpago: any[];
  paises: any[] = [];
  ciudades: any[] = [];
  sino = [
    { label: 'Si', value:'si'},
    { label: 'No', value:'no'},
  ]

  constructor(private fb: FormBuilder, 
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private clientesServ: ClientesService,              
              private paisesCiudadesServ: PaisesCiudadesService,
              public dialogService: DialogService) {
    this.usuario = this.usuariosServ.getUserLogged()
    this.crearFormulario();
   }

  ngOnInit(): void {
    this.todosLosPaises();
    this.clientesServ.autollenado().then((resp: any) => {
      console.log(resp); 
      resp.forEach(element => {
        switch (element.label) {
          case 'vendedor':
            this.vendedor = element.data;
            break;

          case 'tipo documento':
            this.documento = element.data;
            break;

          case 'tipo negocio':
            this.tiponegocio = element.data;
            break;

          case 'tipo cliente':
            this.tipo_cliente = element.data;
            break;

          case 'condiciones':
            this.condpago = element.data;
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
      const ref = this.dialogService.open(StepclientesComponent, {
        data,
        closeOnEscape: false,
        header: 'Datos Necesarios Creación de Clientes',
        width: '70%'
      });
    }
  }

  buscaPaises(event) {
    console.log(event);    
     this.paisesCiudadesServ.getCiudadesXpaises(event).then((resp:any) => {  
      this.ciudades = resp;
    })   
  }

  todosLosPaises() {
    this.paisesCiudadesServ.getPaises().then((resp: any)=>{
      this.paises = resp;   
    })
  }

  crearFormulario() {
    this.forma = this.fb.group({
      nombre:           ['', Validators.required],
      tipo_documento:   ['', Validators.required],
      num_rnc:          [''],
      vendedor:         ['', Validators.required],
      cedula:           [''],
      limite_credito:   [''],
      tipo_negocio:     ['', Validators.required],
      ncf:              [''],
      generico:         ['', Validators.required],
      direccion:        ['', Validators.required],
      urbanizacion:     ['', Validators.required],
      id_pais:          ['', Validators.required],
      id_ciudad:        ['', Validators.required],
      celular:          ['', Validators.required],
      telefono_casa:    ['', Validators.required],
      email:            [''],      
      tipo_cliente:     ['', Validators.required],
      cond_pago:        ['', Validators.required],
      telefono_oficina: ['', Validators.required],
      url:              [''],
      contacto:         [''],
      usuario_creador:  [this.usuario.username]
    })
  }

  guardarCliente(){
    this.guardando = true;
    console.log(this.forma.value);    
    if (this.forma.invalid) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios'); 
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.guardando = false;
    }else{      
      this.forma.value.usuario_creador = this.usuario.username;
      this.guardando = false;
      this.clientesServ.crearCliente(this.forma.value).then((resp: any)=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);              
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
    if (doc.descripcion === 'cedula') {
      this.cedula = true;
      this.rnc = false;
    } 
    if (doc.descripcion === 'rnc') {
      this.cedula = false;
      this.rnc = true;
    } 
  }
}
