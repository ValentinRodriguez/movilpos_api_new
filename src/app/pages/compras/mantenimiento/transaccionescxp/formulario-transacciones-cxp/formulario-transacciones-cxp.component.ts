import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CatalogoCuentasComponent } from 'src/app/components/catalogo-cuentas/catalogo-cuentas.component';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { CoTransaccionescxpService } from 'src/app/services/co-transaccionescxp.service';
import { OrdenescomprasService } from 'src/app/services/ordenescompras.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StepTransaccionesCxpComponent } from '../step-transacciones-cxp/step-transacciones-cxp.component';

@Component({
  selector: 'app-formulario-transacciones-cxp',
  templateUrl: './formulario-transacciones-cxp.component.html',
  styleUrls: ['./formulario-transacciones-cxp.component.scss']
})
export class FormularioTransaccionesCxpComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;  
  id: number;
  condiciones: any;
  monedas: any[] = [];
  cols: any[];
  cuentas: any[] = [];
  ProveedoresFiltrados: any[];
  proveedores: any[] = [];
  ocExiste = 3;
  productos = [];
  itbis:number;
  retencion:number;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private coTransaccionescxpServ: CoTransaccionescxpService,
              private ordenCompraServ: OrdenescomprasService,
              private cgCatalogoServ: CgcatalogoService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnInit(): void {
    // this.forma.get("num_doc").disable();
    // this.forma.get("fecha_orig").disable();
    // this.forma.get("fecha_proc").disable();
    // this.forma.get("condiciones").disable();

    this.todaLaData();
    this.catalogoEscogido();
    this.cols = [
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'depto', header: 'Departamento' },
      { field: 'sec_aux', header: 'Cod. Auxiliar' },
      { field: 'num_doc', header: 'Documento' },
      { field: 'debito', header: 'Débito' },
      { field: 'credito', header: 'Crédito' },
      { field: 'tipo_cuenta', header: 'Tipo Cuenta' },
      { field: 'porciento', header: 'Porciento' },
      { field: 'retencion', header: 'Retención' },
      { field: 'acciones', header: 'Acciones' }
    ] 

    this.coTransaccionescxpServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      // this.monedasServ.getDato(resp).then((res: any) => {
      //   console.log(res);
      //   this.forma.get('divisa').setValue(res.divisa);
      //   this.forma.get('simbolo').setValue(res.simbolo);
      //   this.forma.patchValue(res);
      // })
    })
  }

  todaLaData() {
    this.coTransaccionescxpServ.autoLlenado().then((resp: any)  => {
      resp.forEach(element => {
        switch (element.label) {

          case 'monedas':
            this.monedas = element.data;
            break;

          case 'condiciones':
            this.condiciones = element.data;
            break;  

          case 'proveedores':
            this.proveedores = element.data;
            break; 

          default:
            break;
        }
      });  
      this.autollenado(resp);  
    })
  }

  catalogoEscogido() {
    this.cgCatalogoServ.catalogoEscogido.subscribe((resp: any) => {
      console.log(resp);      
      resp.forEach(cuentas => {
        if (cuentas.tipo_cuenta !== "normal") {
          this.cuentas.push(cuentas);
          this.agregarFormulario(cuentas);
        }
      });               
    })
  }

  get cuentas_no() {   
    return this.forma.get('cuentas_no') as FormArray;
  }

  agregarFormulario(cuentas) {
    console.log(cuentas);    
    (<FormArray>this.forma.get('cuentas_no')).push(this.agregarFormularioTransacciones(cuentas));    
  }
  
  agregarFormularioTransacciones(cuentas): FormGroup {
    return this.fb.group({
      cuenta:  [cuentas.cuenta_no, Validators.required],
      debito:  ['', Validators.required],  
      credito: ['', Validators.required]
    });
  }
  
  datosProv(event) {
    console.log(event);
    const cuenta = event.cuentas_proveedor;
    this.monedas = JSON.parse(event.moneda) 

    cuenta.forEach(cuentas => {
      if (cuentas.tipo_cuenta !== "normal") {
        this.cuentas.push(cuentas);
        this.agregarFormulario(cuentas);
      }
    });

    this.forma.get('condiciones').setValue(this.condiciones.find(doc => doc.cond_pago === event.cond_pago))
    this.forma.get("cod_sp").setValue(event.cod_sp);
    this.forma.get("cod_sp_sec").setValue(event.cod_sp);

    this.forma.get("fecha_orig").enable();
    this.forma.get("fecha_proc").enable();
    this.forma.get("condiciones").enable();
  }

  autollenado(data) {
    let existe = null;
    data.forEach(element => {            
      if (element.data.length === 0) {
        existe = true;
      }
    });
    if (existe === true) {
      const ref = this.dialogService.open(StepTransaccionesCxpComponent, {
        data,
        closeOnEscape: false,
        header: 'Datos Necesarios Creación Factura Proveedores',
        width: '70%'
      });
    }
  }

  crearFormulario() {
    this.forma = this.fb.group({
      num_doc:             ['', Validators.required],
      fecha_orig:          [{value: '', disabled: true}, Validators.required],
      fecha_proc:          [{value: '', disabled: true}, Validators.required],
      valor:               ['', Validators.required],
      condiciones:         [{value: '', disabled: true}, Validators.required],
      orden_no:            ['', Validators.required],
      monto_impuesto:      ['', Validators.required],
      valor_orden:         ['', Validators.required],
      valor_recibido:      ['', Validators.required],
      moneda:              ['', Validators.required],
      servicios:           ['', Validators.required],
      ncf:                 ['', Validators.required],
      tipo_gasto:          ['', Validators.required],
      bienes:              ['', Validators.required],
      retencion:           ['', Validators.required],
      proveedor:           ['', Validators.required],
      cod_sp:              ['', Validators.required],
      cod_sp_sec:          ['', Validators.required],
      observacion:         ['', Validators.required],
      cuentas_no:          this.fb.array([]),
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarFproveedor(){
    //this.guardando = true;
    console.log(this.forma.value);
        
    // if (this.forma.invalid) {       
    //   this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
    //   Object.values(this.forma.controls).forEach(control =>{          
    //     control.markAllAsTouched();
    //   })
    // }else{   
    //   this.coTransaccionescxpServ.crearFactura(this.forma.value).then((resp: any)=>{
    //     if (resp) {
    //       this.guardando = false;
    //       this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);  
    //     }               
    //   })
    // }
  }

  actualizarFactura(){
    //this.actualizando = true;
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.coTransaccionescxpServ.actualizarFactura(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);
        this.actualizando = false;
      })
    }
  }

  calcula(data) {
    console.log(data);    
    this.cuentas.forEach(element => {
      console.log(element.tipo_cuenta);
      console.log(element.retencion);
      
      if (element.tipo_cuenta === 'impuestos' && element.retencion === 'no') {
        
      }
      if (element.tipo_cuenta === 'impuestos' && element.retencion === 'si') {
        
      }
    });
  }

  verificaOrdenCompra(data) {        
    if (data === "") {
      this.ocExiste = 3;
      return;
    }
    this.ocExiste = 0;
    this.ordenCompraServ.buscaOrdenCompra(data).then((resp: any)=>{
      if(resp.length !== 0){      
        console.log(resp);
        this.ocExiste = 1;          
        this.forma.controls['proveedor'].setValue(this.proveedores.find(proveedor => proveedor.cod_sp === resp[0].cod_sp && 
                                                                        proveedor.cod_sp_sec === resp[0].cod_sp_sec))
        this.forma.controls['valor_recibido'].setValue(resp[0].valor_recibido);
      }else{
        this.ocExiste = 2;
        return;
      }
    })
  }

  setVencimiento() {    
    const fecha_orig = this.forma.get('fecha_orig').value;
    const vencimiento = this.forma.get('condiciones').value;
    
    var tmpDate = new Date(fecha_orig);     
    var now = tmpDate.getTime();
    
    this.forma.get('fecha_proc').setValue(this.sumarDias(new Date(now),vencimiento.dias)); 
  }

  sumarDias(fecha, dias){ 
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  filtrarProveedor(event) {
    const filtered: any[] = [];
    const query = event.query;
    
    for (let i = 0; i < this.proveedores.length; i++) {
      const size = this.proveedores[i];
      
      if (size.nom_sp.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.ProveedoresFiltrados = filtered;
  }


  buscaCuentas() {
    const ref = this.dialogService.open(CatalogoCuentasComponent, {
      header: 'Catalogo de cuentas',
      width: '50%'
    });
  }
  
  borrarCatEscogido(id) {
    this.cuentas.splice(id,1)  
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.coTransaccionescxpServ.guardando();    
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
