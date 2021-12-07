import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CgcatalogoService } from 'src/app/services/contabilidad/cgcatalogo.service';
import { CodMovService } from 'src/app/services/inventario/cod-mov.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

import { ListadoCatalogoCuentasComponentsComponent } from 'src/app/components/listado-catalogo-cuentas-components/listado-catalogo-cuentas-components.component';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

@Component({
  selector: 'app-formulario-tipo-mov',
  templateUrl: './formulario-tipo-mov.component.html',
  styleUrls: ['./formulario-tipo-mov.component.scss']
})

export class FormularioTipoMovComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
   
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
    
  listSubscribers: any = [];

  origenes = [
    {label: 'Débito', value: 'debito'},
    {label: 'Crédito', value: 'credito'},
  ];
  
  sino = [
    {label: 'Sí', value: 'si'},
    {label: 'No', value: 'no'},
  ];

  constructor(private fb: FormBuilder,
    private usuariosServ: UsuarioService,
    private uiMessage: UiMessagesService,
    private CodMovServ: CodMovService,
    private cgCatalogoServ: CgcatalogoService,  
    public dialogService: DialogService) {       
      this.crearFormulario();
      this.usuario = this.usuariosServ.getUserLogged();
    }

  ngOnInit(): void {    
    this.listObserver();

    this.cols2 = [
      { field: 'descripcion', header: 'Descripción' },
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'origen', header: 'Origen' },
      { field: 'tipo_cuenta', header: 'Tipo Cuenta' },
      { field: 'catalogo', header: 'Catálogo' },
      { field: 'acciones', header: 'Acciones' },
    ]
  }

  listObserver = () => {
    const observer1$ = this.cgCatalogoServ.catalogoEscogido.subscribe((resp: any) => {             
      console.log(resp);    
      this.cgcatalogos = resp;
      this.cgcatalogos.forEach(element => {
        this.forma.controls['cuentas'].setValue(element.uid);
      });            
    })

    const observer2$ = this.CodMovServ.actualizar.subscribe((resp: any) =>{
      console.log(resp);
      this.guardar = false;
      this.actualizar = true;   
      this.id = resp.uid;      
      this.resetFormulario();
      this.forma.patchValue(resp);
      this.forma.get('origen').setValue(this.origenes.find(tipo => tipo.value === resp.origen));
      let cuenta = [] 
      this.cgcatalogos = resp.cuentas;
      this.cgcatalogos.forEach(element => {
        cuenta.push(element._id);
      });     
      this.forma.controls['cuentas'].setValue(cuenta); 
    })

    this.listSubscribers = [observer1$,observer2$];
  };
  
  crearFormulario() {
    this.forma = this.fb.group({
      titulo:                ['', Validators.required],
      origen:                ['', Validators.required],
      cuentas:               ['', Validators.required],
      descripcion:           ['movimiento de exportaciones', Validators.required],
      control_clientes:      ['no', Validators.required],
      control_despachos:     ['no', Validators.required],
      control_departamento:  ['no', Validators.required],
      control_devoluciones:  ['no', Validators.required],
      control_transferencia: ['no', Validators.required],
      control_orden_compra:  ['no', Validators.required],
      usuario_modificador:   ['']
    })
  }
 
  todosLosUsuarios() {
    this.usuariosServ.getUsers().subscribe((resp: any) => {
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
    console.log(this.forma.value);
    
    if (this.forma.invalid) {   
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');  
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })          
    }else{   
      switch (this.movimientoExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe un tipo de movimiento con este nombre');          
          break;

        default:
          if (this.actualizar) {
            this.forma.get('usuario_modificador').setValue(this.usuario.username);
            this.CodMovServ.actualizarTipoMov(this.id, this.forma.value).subscribe((resp: any) => {
              if (resp.ok) {
                this.CodMovServ.tipoMovActualizado.emit(resp);
                this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Movimiento actualizado de manera exitosa');
                this.resetFormulario();
              }
            })
          }else{
            this.CodMovServ.crearTipoMov(this.forma.value).subscribe((resp: any)=>{   
              if (resp.ok) {
                this.CodMovServ.tipoMovGuardado.emit(resp);
                this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');  
                this.resetFormulario();                
              }         
            })
          }
        break;
      } 
    }     
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.CodMovServ.guardando();   
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.enable();
    this.cgcatalogos = [];
    this.forma.get('cuentas').setValue('');
    this.forma.get('control_clientes').setValue('no');
    this.forma.get('control_despachos').setValue('no');
    this.forma.get('control_departamento').setValue('no');
    this.forma.get('control_devoluciones').setValue('no');
    this.forma.get('control_transferencia').setValue('no');
    this.forma.get('control_orden_compra').setValue('no');
  }

  buscaCuentas() {
     this.dialogService.open(ListadoCatalogoCuentasComponentsComponent, {
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
    this.movimientoExiste = 0;
    this.CodMovServ.busquedaCodMov(data).subscribe((resp: any)=>{      
      if (resp.ok) {
        if(resp.data.length === 0) {
          this.movimientoExiste = 1;
        }else{
          this.movimientoExiste = 2;
        }          
      }
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
