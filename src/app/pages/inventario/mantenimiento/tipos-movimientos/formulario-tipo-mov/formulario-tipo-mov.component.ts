import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { CodMovService } from 'src/app/services/cod-mov.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { CatalogoCuentasComponent } from 'src/app/components/catalogo-cuentas/catalogo-cuentas.component';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-tipo-mov',
  templateUrl: './formulario-tipo-mov.component.html',
  styleUrls: ['./formulario-tipo-mov.component.scss']
})
export class FormularioTipoMovComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  loading: boolean;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  movimientoExiste = 3;
  cuentas_no: any[] = []; 
  cgcatalogos: any[] = [];  
  usuarios: any[] = [];  
  cols2: { field: string; header: string; }[];
  id: number;

  origenes = [
    {label: 'Débito', value: 'debito'},
    {label: 'Crédito', value: 'credito'},
  ];
  
  sino = [
    {label: 'Sí', value: 'si'},
    {label: 'No', value: 'no'},
  ];

  constructor(private fb: FormBuilder,
    private uiMessage: UiMessagesService,
    private CodMovServ: CodMovService,
    private cgCatalogoServ: CgcatalogoService,
    private usuariosServ: UsuarioService,
    public dialogService: DialogService) { 
      this.usuario = this.usuariosServ.getUserLogged()
      this.crearFormulario();
    }

  ngOnInit(): void {
     ;
    
    this.todosLosCatalogos();
    this.todosLosUsuarios(); 
    this.catalogoEscogido();

    this.cols2 = [
      { field: 'descripcion', header: 'Descripción' },
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'origen', header: 'Origen' },
      { field: 'tipo_cuenta', header: 'Tipo Cuenta' },
      { field: 'catalogo', header: 'Catálogo' },
      { field: 'acciones', header: 'Acciones' },
    ]

    this.CodMovServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.CodMovServ.getDato(resp).then((res: any) => {
                 
        this.resetFormulario();
        this.forma.patchValue(res.codigosmov[0]);
        this.forma.get('origen').setValue(this.origenes.find(tipo => tipo.value === res.codigosmov[0].origen));
        let cuenta = [] 
        this.cgcatalogos = res.cuentas;
        this.cgcatalogos.forEach(element => {
          cuenta.push(element.cuenta_no);
        });     
        this.forma.controls['cuenta_no'].setValue(cuenta);  
      })
    })
  }
  
  crearFormulario() {
    this.forma = this.fb.group({
      titulo:                ['', Validators.required],
      origen:                ['', Validators.required],
      cuenta_no:             ['', Validators.required],
      email:                 [this.usuario.email, Validators.required],
      descripcion:           ['movimiento de exportaciones', Validators.required],
      control_clientes:      ['no', Validators.required],
      control_despachos:     ['no', Validators.required],
      control_departamento:  ['no', Validators.required],
      control_devoluciones:  ['no', Validators.required],
      control_transferencia: ['no', Validators.required],
      control_orden_compra:  ['no', Validators.required],
      estado:                ['ACTIVO', Validators.required],
      usuario_creador:       [this.usuario.username, Validators.required],
      usuario_modificador:   ['']
    })
  }

  catalogoEscogido() {
    this.cgCatalogoServ.catalogoEscogido.subscribe((resp: any) => {      
      let cuenta = [] 
      this.cgcatalogos = resp;
      this.cgcatalogos.forEach(element => {
        cuenta.push(element.cuenta_no);
      });     
      this.forma.controls['cuenta_no'].setValue(cuenta);     
    })
  }
  todosLosCatalogos() {
    this.cgCatalogoServ.getDatosAux().then((resp: any) => {
      this.cuentas_no = resp;     
    })
  }

  todosLosUsuarios() {
    this.usuariosServ.getUsers().then((resp: any) => {
      this.usuarios = resp;    
    })
  }

  tipoOrigen(data) {  
    if (data.value === 'credito') {
      this.forma.controls['control_orden_compra'].disable();
    }else{
      this.forma.controls['control_orden_compra'].enable();
    }
  }

  controlDespachos(control) {
    if (control === 'si') {
      this.forma.controls['control_devoluciones'].disable();
    }else{
      this.forma.controls['control_devoluciones'].enable();
    }
  }

  controldevoluciones(control) {
    if (control === 'si') {
      this.forma.controls['control_despachos'].disable();
    }else{
      this.forma.controls['control_despachos'].enable();
    }
  }

  controlOrdenCompra(control) {
    if (control === 'si') {
      this.forma.controls['control_clientes'].disable();
      this.forma.controls['control_transferencia'].disable();
    }else{
      this.forma.controls['control_clientes'].enable();
      this.forma.controls['control_transferencia'].enable();
    }
  }

  controlTransferencia(control) {
    const origen = this.forma.get('origen').value
    if (origen.value === 'credito') {
      return;
    }
    if (control === 'si') {
      this.forma.controls['control_orden_compra'].disable();
    }else{
      this.forma.controls['control_orden_compra'].enable();
    }
  }

  controlClientes(control) {
    if (control === 'si') {
      this.forma.controls['control_orden_compra'].disable();
    }else{
      this.forma.controls['control_orden_compra'].enable();
    }
  }

  borrarCatEscogido(id) {
    this.cgcatalogos.splice(id,1)  
  }

  detalleCatalogo(cgcatalogo) {

  }
    
  guardarcodMov(){
    //this.guardando = true;
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');  
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.guardando = false;    
    }else{   
      switch (this.movimientoExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          this.guardando = false;
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe un tipo de movimiento con este nombre');
          this.guardando = false;
          break;

        default:
          this.CodMovServ.crearTipoMov(this.forma.value).then((resp: any)=>{
            this.guardando = false;
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);  
            this.resetFormulario();
          })
        break;
      } 
    }
  }

  actualizarMov(){    
     //this.actualizando = true;
     this.forma.get('usuario_modificador').setValue(this.usuario.username);    
     if (this.forma.invalid) {       
       this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
       Object.values(this.forma.controls).forEach(control =>{          
         control.markAllAsTouched();
       })
     }else{ 
      switch (this.movimientoExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          this.guardando = false;
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe un tipo de movimiento con este nombre');
          this.guardando = false;
          break;

        default:
          this.forma.get('usuario_modificador').setValue(this.usuario.username);
          this.CodMovServ.actualizarTipoMov(this.id, this.forma.value).then(() => {
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Movimiento creado de manera exitosa');
            this.resetFormulario();
          })
        break;
      }    
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.CodMovServ.guardando();    
     ;    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.enable();
    this.cgcatalogos = [];
    this.forma.get('cuenta_no').setValue('');
    this.forma.get('estado').setValue('activo');
    this.forma.get('email').setValue(this.usuario.email);
    this.forma.get('control_clientes').setValue('no');
    this.forma.get('control_despachos').setValue('no');
    this.forma.get('control_departamento').setValue('no');
    this.forma.get('control_devoluciones').setValue('no');
    this.forma.get('control_transferencia').setValue('no');
    this.forma.get('control_orden_compra').setValue('no');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
     
    
  }

  buscaCuentas() {
    // this.catalogos = true
    const ref = this.dialogService.open(CatalogoCuentasComponent, {
      data: {
        cuentas: this.cuentas_no
      },
      header: 'Catalogo de cuentas',
      width: '50%'
    });
  }

  verificaTipoMovimiento(data){
    if (data === "") {
      this.movimientoExiste = 3;
      return;
    }
    let param = {'titulo': data};
    this.movimientoExiste = 0;
    this.CodMovServ.busquedaCodMov(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.movimientoExiste = 1;
      }else{
        this.movimientoExiste = 2;
      }  
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
