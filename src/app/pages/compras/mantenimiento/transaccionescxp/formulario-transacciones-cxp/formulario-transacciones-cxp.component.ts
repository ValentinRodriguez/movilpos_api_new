import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CoTransaccionescxpService } from 'src/app/services/co-transaccionescxp.service';
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

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private coTransaccionescxpServ: CoTransaccionescxpService,
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
    this.cols = [
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'depto', header: 'Departamento' },
      { field: 'sec_aux', header: 'Cod. Auxiliar' },
      { field: 'num_doc', header: 'Documento' },
      { field: 'debito', header: 'Débito' },
      { field: 'credito', header: 'Crédito' },
      { field: 'tipo_cta', header: 'Tipo Cuenta' },
      { field: 'porciento', header: 'Porciento' },
      { field: 'retencion', header: 'Retención' }
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

  datosProv(event) {
    console.log(event);
    
    this.monedas = JSON.parse(event.moneda) 
    this.forma.get('condiciones').setValue(this.condiciones.find(doc => doc.cond_pago === event.cond_pago))
    this.forma.get("cod_sp").setValue(event.cod_sp);
    this.forma.get("cod_sp_sec").setValue(event.cod_sp);
    this.cuentas = event.cuentas_proveedor;

    this.forma.get("fecha_orig").enable();
    this.forma.get("fecha_proc").enable();
    this.forma.get("condiciones").enable();

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
