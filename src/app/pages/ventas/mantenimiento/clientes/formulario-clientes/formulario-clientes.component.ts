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
  ciudades: any[] = [];
  tipo_proveedor=[];
  actualizando = false;

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
     // console.log(resp); 
      resp.forEach(element => {
        switch (element.label) {
          case 'vendedor':
            this.vendedor = element.data;
            break;

          case 'tipo documento':
            this.documento = element.data;
       //     console.log(this.documento);
            
            break;

          case 'tipo negocio':
            this.tiponegocio = element.data;
            break;

          case 'tipo cliente':
            this.tipo_cliente = element.data;
            console.log(this.tipo_cliente)
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

    this.clientesServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar=true;   
      this.id = Number(resp);      
      console.log(resp);
      this.clientesServ.getdato(resp).then((res: any) => {
     
        this.forma.patchValue(res);
        console.log(res)
        
        this.forma.get('tipo_documento').setValue(this.documento.find(doc => doc.tipo_documento == res.tipo_documento)); 
       // this.forma.get('tipo_cliente').setValue(this.tipo_cliente.find(doc => doc.id == res.tipo_cliente)); 
        this.forma.get('vendedor').setValue(this.vendedor.find(doc => doc.id_numemp == res.vendedor)); 
        this.forma.get('cond_pago').setValue(this.condpago.find(doc => doc.id == res.cond_pago)); 
      console.log(this.tipo_cliente)
        this.forma.get('tipo_negocio').setValue(this.tiponegocio.find(doc => doc.tipo_negocio == res.tipo_negocio)); 
        this.forma.get('id_pais').setValue(this.paises.find(pais => pais.id_pais === res.id_pais));    
        this.paisesCiudadesServ.getCiudadesXpaises(res.id_pais).then((resp:any) => { 
          this.ciudades = resp;
          this.forma.get('id_ciudad').setValue(this.ciudades.find(ciudad => ciudad.id_ciudad === res.id_ciudad));
        })
       
      })
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
      nombre:               ['joselito perez', Validators.required],
      tipo_documento:       ['', Validators.required],
      vendedor:             ['', Validators.required],
      documento:            ['22500192319'],
      limite_credito:       [''],
      tipo_negocio:         ['', Validators.required],
      ncf:                  ['B0100066853'],
      generico:             ['', Validators.required],
      direccion:            ['santo domingo', Validators.required],
      urbanizacion:         ['dfgdfg', Validators.required],
      id_pais:              ['', Validators.required],
      id_ciudad:            ['', Validators.required],
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
    this.guardando = true;
    console.log(this.forma);    
    if (this.forma.invalid) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios'); 
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.guardando = false;
    }else{      
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
    if (doc === 'cedula') {
      console.log(doc);    
      this.cedula = true;
      this.rnc = false;
      this.pasaporte = false;
    } 
    if (doc === 'RNC') {
      console.log(doc); 
      this.cedula = false;
      this.rnc = true;
      this.pasaporte = false;
    } 
    if (doc === 'pasaporte') {
      console.log(doc); 
      this.cedula = false;
      this.rnc = false;
      this.pasaporte = true;
    } 
  }
  
  actualizarCliente() {
   // console.log(this.forma);
   console.log(this.tipo_cliente);
    this.guardar=false;  
    this.actualizar=true;   
    this.forma.get('usuario_modificador').setValue(this.usuario.username);     
    if (this.forma.invalid) {      
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.guardando = false;
    }else{      
      this.guardando = false;
      this.clientesServ.actualizarCliente(this.id, this.forma.value).then((resp: any)=>{
    
        this.actualizando=false;
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
                 
      })
    } 
  } 
}
