import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CatalogoCuentasComponent } from 'src/app/components/catalogo-cuentas/catalogo-cuentas.component';
import { FacturasPendientesComponent } from 'src/app/components/facturas-pendientes/facturas-pendientes.component';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { CoTransaccionescxpService } from 'src/app/services/co-transaccionescxp.service';
import { SecuenciasService } from 'src/app/services/secuencias.service';
import { TransacionPagosService } from 'src/app/services/transacion-pagos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-transacciones-pago',
  templateUrl: './formulario-transacciones-pago.component.html',
  styleUrls: ['./formulario-transacciones-pago.component.scss']
})
export class FormularioTransaccionesPagoComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  transaccionExiste = 3;
  proveedores: any[] = [];
  id: number;
  ProveedoresFiltrados: any[] = [];
  minDate: Date;
  tipo_documentos: any;
  monedas: any[] = [];
  cols: { field: string; header: string; }[];
  // cuentas: any[] = [];
  detalleCxp: any[] = [];
  detalleCuentas: any[] = [];
  departamentos: any[] = [];
  divisa= 'DOP';
  simbolo='$RD';

  totalF = 0;
  totalVpen= 0;
  totalVpag= 0;

  totalC = 0;
  totalD = 0;

  cols2: { field: string; header: string; }[];
  tipo_ordenes: any;
  facturaExiste = 3;
  cheque_prep = false;
  @ViewChild("headerCxp") headerCxp: ElementRef;
  @ViewChild("headerCxp") headerCuentas: ElementRef;
  afectaCXP = false;
  esValido = false;
  sFragment: string;
  opciones: any[];
  value1: string = "no";
  formSubmitted = false;
  listSubscribers: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private transaccionsServ: TransacionPagosService,
              private cgCatalogoServ: CgcatalogoService,
              private transaccionescxpServ: CoTransaccionescxpService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.opciones = [{label: 'Sí', value: 'si'}, {label: 'No', value: 'no'}];
                this.crearFormulario();
  }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.setMinDate();
    this.listObserver();
    
    this.transaccionsServ.autoLlenado().then((resp: any)  => {      
        resp.forEach(element => {
        switch (element.label) {
          case 'tipo documentos':
            this.tipo_documentos = element.data;
            break;

          case 'proveedores':
            this.proveedores = element.data;
            break;

          case 'departamento':
            this.departamentos = element.data;
            break;

          case 'tipo ordenes':
            this.tipo_ordenes = element.data;
            break;

          default:
            break;
        }
      });  
      //this.autollenado(resp);  
    })

    this.cols = [
      { field: 'tipo_orden',      header: 'Tipo Orden' },
      { field: 'orden_no',        header: 'No. Orden' },
      { field: 'aplica_a',        header: 'Factura' },
      { field: 'total',           header: 'Total' },
      { field: 'valor_pendiente', header: 'Valor Pendiente' },
      { field: 'valor',           header: 'Monto a Pagar' },
      { field: 'acciones',        header: 'Acciones' }
    ] 

    this.cols2 = [
      { field: 'cuenta_no',    header: 'Cuenta' },
      { field: 'departamento', header: 'Departamento' },
      { field: 'catalogo',     header: 'Catalogo' },
      { field: 'cod_sec',      header: '' },
      // { field: 'ref',          header: 'Referencia' },
      { field: 'debito',       header: 'Débito' },
      { field: 'credito',      header: 'Crédito' },
      { field: 'acciones',     header: 'Acciones' }
    ] 
  }  

  listObserver = () => {
    const observer1$ = this.forma.statusChanges.subscribe( value =>{
      if (value === 'VALID' && this.esValido === false) {
        this.esValido = true;
        this.confirmationService.confirm({
          message:"Desea afectar CUENTAS POR PAGAR?",
          accept:() =>{ 
            this.dialogCxp();
            this.value1 = 'si';
          }
        })
      }   
    })

    const observer2$ = this.cgCatalogoServ.catalogoEscogido.subscribe((resp: any) => {
      resp.forEach(cuenta => {
        if (cuenta.tipo_cuenta !== "normal") {
          cuenta.tipo = this.forma.get('tipo_doc').value
          cuenta.fecha = this.forma.get('fecha').value
          // cuenta.documento = this.forma.get('documento').value;
          cuenta.tipo_doc = this.forma.get('tipo_doc').value.ref;

          this.detalleCuentas.push(cuenta);
          this.agregarFormularioDetallesCuentas(cuenta);
        }
      });               
    })

    const observer3$ = this.transaccionescxpServ.facturaEscogida.subscribe((resp: any) => {
      resp.forEach(factura => {
        factura.pendiente = Number(factura.valor) - Number (factura.pagado);
        factura.fecha_orig = this.forma.get('fecha').value;
        factura.cod_sp = this.forma.get('cod_sp').value;
        factura.cod_sp_sec = this.forma.get('cod_sp_sec').value;
        factura.moneda = this.forma.get('moneda').value.id;
        factura.tipo_doc = this.forma.get('tipo_doc').value.ref;
        // factura.documento = this.forma.get('documento').value;
        
        this.totalF += factura.valor;
        this.totalVpen += factura.pendiente;
        this.detalleCxp.push(factura);
        this.agregarFormularioDetallesCXP(factura)
      });               
    })

    const observer5$ = this.transaccionsServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
      console.log(resp);      
    })

    this.listSubscribers = [observer1$,observer5$,observer2$,observer3$];
  };

  afectaCuentasPagar(e) {
    if (e === 'si') {
      this.dialogCxp();
      this.value1 = 'si';
    }else{
      this.afectaCXP = false;
    }    
  }
  
  dialogCxp() {
    this.buscaFacturas();
    this.afectaCXP === true;
  }

  crearFormulario() {
    this.forma = this.fb.group({
      tipo_doc:            ['', Validators.required],
      cuenta_no:           ['9872123345'],
      proveedor:           ['', Validators.required],
      cod_sp:              [''],
      cod_sp_sec:          [''],
      nombre_sup:          ['', Validators.required],
      fecha:               ['', Validators.required],
      moneda:              ['', Validators.required],
      tasa:                ['1'],
      valor:               ['1000', Validators.required],
      detalle:             ['xdfgsdfg dsfgdsfg sdfgsdgf'],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      detalle_cxp:         this.fb.array([]),
      detalle_cuentas:     this.fb.array([]),
      usuario_modificador: ['']
    })
  }

  get MontoPago() {   
    return Number(this.forma.get('valor').value as FormGroup);
  }

  get detalle_cxp() {   
    return this.forma.get('detalle_cxp') as FormArray;
  }

  agregarFormularioDetallesCXP(factura) {
    (<FormArray>this.forma.get('detalle_cxp')).push(this.formularioDetallesCXP(factura));    
  }
  
  get detalle_cuentas() {   
    return this.forma.get('detalle_cuentas') as FormArray;
  }

  agregarFormularioDetallesCuentas(cuenta) {
    (<FormArray>this.forma.get('detalle_cuentas')).push(this.formularioDetallesCuentas(cuenta));    
  }
  
  formularioDetallesCXP(factura): FormGroup {
    return this.fb.group({
      tipo_orden:      ['', Validators.required], //
      orden_no:        [''],
      // num_doc:         [factura.documento, Validators.required],//
      total:           [factura.valor],
      valor_pendiente: [factura.pendiente, Validators.required],//
      fecha_orig:      [factura.fecha_orig, Validators.required],   //   
      monto_itbi:      [0, Validators.required],//
      tipo_doc:        [factura.tipo_doc, Validators.required],//
      cod_sp:          [factura.cod_sp],
      cod_sp_sec:      [factura.cod_sp_sec],
      moneda:          [factura.moneda, Validators.required],//
      cod_cia:         [this.usuario.empresa.cod_cia, Validators.required],//
      aplica_a:        [factura.num_doc, Validators.required],//
      valor:           ['', Validators.required],//
      detalle:         ['sadfadsf', Validators.required],
      ncf:             [0, Validators.required],
      estado:          ['activo'],
      usuario_creador: [this.usuario.username],
    });
  }

  formularioDetallesCuentas(cuenta): FormGroup {
    return this.fb.group({
      cuenta_no:       [cuenta.cuenta_no],
      departamento:    [''],
      ref:             [''],
      // cuenta_banco:    [cuenta.documento],
      debito:          [''],
      credito:         [''],
      fecha:           [cuenta.fecha],
      tipo_doc:        [cuenta.tipo_doc],
      num_doc:         [],
      cod_aux:         [cuenta.catalogo],
      cod_sec:         [12],
      estado:          ['activo', Validators.required],
      usuario_creador: [this.usuario.username, Validators.required],
    });
  }

  totalMontoPagar() {
    this.totalVpag = 0;    
    this.detalle_cxp.value.forEach((element:any) => {           
      this.totalVpag += Number(element.valor) || 0;    
    });    
  }

  guardarTransaccion(){
    this.formSubmitted = true;
    if (this.forma.invalid) {  
      this.formSubmitted = false;     
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{
      if (this.afectaCXP) {
        if (this.totalVpag !== this.MontoPago) {
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','El monto a pagar es diferente al monto especifica en la/s factura/s.'); 
          this.headerCxp.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
          return;  
        }
      }   
      
      if (((Number(this.totalD) + Number(this.totalC)) / 2) !== Number(this.MontoPago)) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Los valores de DEBITO y CREDITO no cuadran con el monto a pagar.'); 
        this.headerCuentas.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
        return;  
      }  

      if (this.totalD !== this.totalC) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Los montos totales de debito y credito de ser iguales.'); 
        this.headerCuentas.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
        return;  
      }
      
      this.transaccionsServ.crearTransaccion(this.forma.value).then(()=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');  
        this.resetFormaulario();
      })
    }
  }
 
  actualizarTransaccion(){
    this.formSubmitted = true; 
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {      
      this.formSubmitted = false; 
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.transaccionsServ.actualizarTransaccion(this.id, this.forma.value).then(() => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormaulario();
      })
    }
  }

  calculaTotal() { 
    this.totalD = 0;
    this.totalC = 0;
    
    this.detalle_cuentas.value.forEach((element:any) => {             
      this.totalD += Number(element.debito) || 0;        
      this.totalC += Number(element.credito) || 0;      
    });    
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
    this.monedas = JSON.parse(event.moneda) 
    this.forma.get("cod_sp").setValue(event.cod_sp);
    this.forma.get("cod_sp_sec").setValue(event.cod_sp);
    this.forma.get("nombre_sup").setValue(event.nom_sp);
  }

  onSelectDate(event) {
    let d = new Date(Date.parse(event));
    this.forma.get("fecha").setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
  }

  setMinDate() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let day = today.getDate();
    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(year);
    this.minDate.setDate(day);
  }

  simboloMoneda(event) {
    this.simbolo = event.value.simbolo;
  }

  prepagado(e) {
    if (e.value.descripcion === 'CHEQUE PREPAGADO') {
      this.cheque_prep = false;
    }else{
      this.cheque_prep = true;
      let index = 0;
      this.detalle_cxp.value.forEach(() => {
        ((this.detalle_cxp).at(index) as FormGroup).get("orden_no").setValue('');
        index++;
      });
    }
  }

  borrarCuentaCxPEscogida(id) {
    this.detalleCxp.splice(id,1)  
  }

  borrarCuentaDetalleEscogida(id) {
    this.detalleCuentas.splice(id,1)   
  }

  buscaCuentas() {
    const ref = this.dialogService.open(CatalogoCuentasComponent, {
      header: 'Catalogo de cuentas',
      width: '50%'
    });
    ref.onClose.subscribe(() =>{
      setTimeout(() => {
        if (this.detalle_cxp.value.length === 0) {
          this.value1 = 'no';
        }
      }, 300);
    });
  }

  buscaFacturas() {
     this.dialogService.open(FacturasPendientesComponent, {
      header: 'Facturas Pendientes',
      width: '70%'
    });
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormaulario();
    this.transaccionsServ.guardando();    
  }

  resetFormaulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }
  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
