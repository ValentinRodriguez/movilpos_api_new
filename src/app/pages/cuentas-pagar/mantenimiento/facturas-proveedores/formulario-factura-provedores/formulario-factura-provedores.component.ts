import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ListadoCatalogoCuentasComponentsComponent } from 'src/app/components/listado-catalogo-cuentas-components/listado-catalogo-cuentas-components.component';
import { CoTransaccionescxpService } from 'src/app/services/cuentas-pagar/co-transaccionescxp.service';
import { OrdenescomprasService } from 'src/app/services/compras/ordenescompras.service';
import { CgcatalogoService } from 'src/app/services/contabilidad/cgcatalogo.service';

import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { StepFacturaProvedoresComponent } from '../step-factura-provedores/step-factura-provedores.component';

@Component({
  selector: 'app-formulario-factura-provedores',
  templateUrl: './formulario-factura-provedores.component.html',
  styleUrls: ['./formulario-factura-provedores.component.scss']
})
export class FormularioFacturaProvedoresComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;  
  id: number;
  cond_pago: any[] = [];
  monedas: any[] = [];
  cols: any[];
  cuentas: any[] = [];
  ProveedoresFiltrados: any[];
  proveedores: any[] = [];
  ocExiste = 3;
  productos = [];
  totalC = 0;
  totalD = 0;
  tipoGastos: any;
  departamentos: any[] = [];
  divisa= 'DOP';
  simbolo='$RD';
  tipoOrden:any[] = [];
  itbis: string = "si";
  opciones: any[];
  
  listSubscribers: any = [];
  cuentaForm = '';
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              
              private coTransaccionescxpServ: CoTransaccionescxpService,
              private ordenCompraServ: OrdenescomprasService,
              private cgCatalogoServ: CgcatalogoService,
              public dialogService: DialogService,
              private cd: ChangeDetectorRef) { 
                ;    
                this.opciones = [{label: 'Sí', value: 'si'}, {label: 'No', value: 'no'}];                          
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todaLaData();
    this.listObserver();

    this.cols = [
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'catalogo', header: 'Cod. Auxiliar' },
      { field: 'referencia', header: 'Documento' },
      { field: 'debito', header: 'Débito' },
      { field: 'credito', header: 'Crédito' },
      { field: 'departamento', header: 'Departamento' },
      { field: 'tipo_cuenta', header: 'Tipo Cuenta' },
      { field: 'porciento', header: 'Porciento' },
      { field: 'retencion', header: 'Retención' },
      { field: 'acciones', header: 'Acciones' }
    ] 

    this.tipoOrden = [
      { id:1, descripcion:'Generales' },
      { id:2, descripcion:'Rov.ltd' },
      { id:3, descripcion:'Locales' },
      { id:4, descripcion:'Miscelaneas' },
    ]
  }

  listObserver = () => {
    const observer1$ = this.cgCatalogoServ.catalogoEscogido.subscribe((resp: any) => {
      resp.forEach(cuentas => {
        if (cuentas.tipo_cuenta !== "normal") {
          this.cuentas.push(cuentas);
          this.agregarFormulario(cuentas);
        }
      });    
      this.calcula();
    })

    const observer2$ = this.coTransaccionescxpServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);
      this.cuentas = [];
      let index = 0;
      
      this.coTransaccionescxpServ.getDato(this.id).then((res: any) => {
        this.forma.get('proveedor').setValue(this.proveedores.find(proveedor => proveedor.cod_sp === res.cod_sp && 
                                                                                proveedor.cod_sp_sec === res.cod_sp_sec))
          
        this.forma.get('cond_pago').setValue(this.cond_pago.find(doc => doc.cond_pago === res.cond_pago)); //
        this.forma.get('fecha_orig').setValue(new Date(res.fecha_orig))   //  
        this.forma.get('fecha_proc').setValue(new Date(res.fecha_proc)) //
        this.forma.get('valor').setValue(res.valor) //

        this.forma.get('cond_pago').enable()
        this.forma.get('fecha_orig').enable()
        this.forma.get('fecha_proc').enable()
        this.forma.get('valor').enable()

        this.forma.get('tipo_orden').setValue(this.tipoOrden.find(doc => doc.id === res.tipo_orden));
        this.forma.get('moneda').setValue(this.monedas.find(doc => doc.descripcion === res.moneda));
        this.forma.get('codigo_fiscal').setValue(this.tipoGastos.find(doc => doc.codigo_fiscal === res.codigo_fiscal));
        this.forma.get('num_doc').setValue(res.num_doc)        
        this.forma.get('orden_no').setValue(res.orden_no)       
        this.forma.get('monto_itbi').setValue(res.monto_itbi)    
        this.forma.get('valor_orden').setValue(res.valor_orden)    
        this.forma.get('valor_recibido').setValue(res.valor_recibido) 
        this.forma.get('tipo_doc').setValue(res.tipo_doc)       
        this.forma.get('cod_sp').setValue(res.cod_sp)         
        this.forma.get('cod_sp_sec').setValue(res.cod_sp_sec)
        this.forma.get('bienes').setValue(res.bienes)         
        this.forma.get('servicios').setValue(res.servicios)      
        this.forma.get('retencion').setValue(res.retencion)      
        this.forma.get('detalle').setValue(res.detalle)        
        this.forma.get('ncf').setValue(res.ncf)            
        this.forma.get('cod_cia').setValue(res.cod_cia)
        this.forma.get('cuotas').setValue(res.cuotas)
        this.forma.get('estado').setValue(res.estado)  
        this.forma.get('itbis').setValue(res.itbis)       
        this.itbis = res.itbis;

        res.detalle_factura.forEach(element => {
          this.cuentas.push(element);
          this.agregarFormulario(element);
          ((this.cuentas_no).at(index) as FormGroup).get("departamento").setValue(this.departamentos.find(doc => doc.id === element.departamento)); 
          this.totalC += Number(((this.cuentas_no).at(index) as FormGroup).get("credito").value); 
          this.totalD += Number(((this.cuentas_no).at(index) as FormGroup).get("debito").value);
          index++;
        });
      })
    })
    
    this.listSubscribers = [observer1$,observer2$];
  };

  todaLaData() {
    this.coTransaccionescxpServ.autoLlenado().then((resp: any)  => {
      resp.forEach(element => {        
        switch (element.label) {
          case 'monedas':            
            this.monedas = element.data;
            break;

          case 'condiciones':
            this.cond_pago = element.data;
            break;  

          case 'proveedores':
            this.proveedores = element.data;
            break; 

          case 'tipo gastos':
            this.tipoGastos = element.data;
            break; 

          case 'departamento':
            this.departamentos = element.data;
            break;

          default:
            break;
        }
      });  
      this.autollenado(resp);  
    })
  }

  get cuentas_no() {   
    return this.forma.get('cuentas_no') as FormArray;
  }

  get montoFactura() {   
    return this.forma.get('valor') as FormGroup;
  }

  get codSp() {   
    return this.forma.get('cod_sp') as FormGroup;
  }

  get codSpSec() {   
    return this.forma.get('cod_sp_sec') as FormGroup;
  }

  get ncf() {   
    return this.forma.get('ncf') as FormGroup;
  }

  agregarFormulario(cuentas) {
    (<FormArray>this.forma.get('cuentas_no')).push(this.agregarFormularioTransacciones(cuentas));    
  }
  
  agregarFormularioTransacciones(cuentas): FormGroup {
    return this.fb.group({
      tipo_cuenta:     [cuentas.tipo_cuenta, Validators.required],
      fecha:           [''],
      cod_sp:          [''], //
      cod_sp_sec:      [''], //
      debito:          [cuentas.debito || ''],  
      credito:         [cuentas.credito || ''],
      porciento:       [cuentas.porciento || 0],
      factura:         [''], //
      tipo_doc:        [''], //
      cuenta_no:       [cuentas.cuenta_no, Validators.required], 
      departamento:    [''],
      num_doc:         [''], 
      cod_aux:         [''],
      cod_sec:         [''],
      detalles:        [''], //
      tipo_fact:       [''], //
      cod_cia:         [''],
      estado:          ['activo'],
      
    });
  }

  autollenado(data) {
    let existe = null;
    data.forEach(element => {  
      if (element.data.length === 0) {
        existe = true;
      }
    });
    
    if (existe === true) {
       this.dialogService.open(StepFacturaProvedoresComponent, {
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
      valor:               [{value: '', disabled: true}, Validators.required],
      cond_pago:           [{value: '', disabled: true}, Validators.required],
      orden_no:            [''],
      monto_itbi:          [0, Validators.required],
      itbis:               ['si', Validators.required],
      valor_orden:         [0],
      valor_recibido:      [0],
      cuotas:              [{value: 1, disabled: true}],
      tipo_doc:            ['FT', Validators.required],
      cod_sp:              ['', Validators.required],
      cod_sp_sec:          ['', Validators.required],
      moneda:              ['', Validators.required],
      bienes:              [0],
      servicios:           [0],
      retencion:           [0],
      cuenta_proveedor:    [0],
      detalle:             [''],
      ncf:                 [{value: '', disabled: true}, Validators.required],
      cod_cia:             ['', Validators.required],
      tipo_orden:          [''],
      codigo_fiscal:       ['', Validators.required],
      proveedor:           ['', Validators.required],
      cuentas_no:          this.fb.array([]),
      estado:              ['activo', Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarFproveedor(){
    this.forma.get('cod_cia').setValue(this.usuario.empresa.cod_cia);    
    if (this.forma.invalid) {  
           
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      if (this.cuentas_no.value.length === 0) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','No hay cuentas vinculadas a la transacción.'); 
        return;
      }

      const diferencia = this.calculaTotal(this.cuentas_no.value);    
      const montoFactura = Number(this.forma.get('valor').value);
      const total = (this.totalD + this.totalC) / 2;
      const fecha_orig = this.forma.get('fecha_orig').value;
      const fecha_proc = this.forma.get('fecha_proc').value;
      // const itbis = Number(this.forma.get('monto_itbi').value);

      this.forma.get('cod_cia').setValue(this.usuario.empresa.cod_cia);
      this.forma.get('fecha_orig').setValue(this.onSelectDate(fecha_orig));
      this.forma.get('fecha_proc').setValue(this.onSelectDate(fecha_proc));    
      
      if (diferencia !== 0) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','La transaccion no esta cuadrada.'); 
        return;
      }
  
      if (total !== montoFactura) {      
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','La transaccion es diferente al valor de la factura.'); 
        return;
      }         
      
      this.coTransaccionescxpServ.crearFactura(this.forma.value).then(()=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');         
        this.restaurarFormulario();
      })
    }
  }

  actualizarFactura(){
     
    const fecha_orig = this.forma.get('fecha_orig').value;
    const fecha_proc = this.forma.get('fecha_proc').value;
    
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    this.forma.get('fecha_orig').setValue(this.onSelectDate(fecha_orig));
    this.forma.get('fecha_proc').setValue(this.onSelectDate(fecha_proc));
    
    if (this.forma.invalid) {  
           
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.coTransaccionescxpServ.actualizarFactura(this.id, this.forma.value).then(() => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');         
        this.restaurarFormulario();
      })
    }
  }
    
  datosProv(event) {
    this.cuentaForm = event.cuenta_no;
    const cuenta = event.cuentas_proveedor;
    this.monedas = JSON.parse(event.moneda) 
    this.cuentas = [];

    while (0 !== this.cuentas_no.length) {
      this.cuentas_no.removeAt(0);
    }

    if (event.cond_pago === 1) {
      this.forma.get("cuotas").enable();
    }else{
      this.forma.get("cond_pago").disable();
    }

    cuenta.forEach(cuentas => {
      if (cuentas.tipo_cuenta !== "normal") {
        this.cuentas.push(cuentas);
        this.agregarFormulario(cuentas);
      }
    }); 

    this.forma.get('cond_pago').setValue(this.cond_pago.find(doc => doc.cond_pago === event.cond_pago))
    this.forma.get("cod_sp").setValue(event.cod_sp);
    this.forma.get("cod_sp_sec").setValue(event.cod_sp);
    this.forma.get("cuenta_proveedor").setValue(event.cuenta_no);
    
    this.forma.get("fecha_orig").enable();
    this.forma.get("fecha_proc").enable();
    this.forma.get("cond_pago").enable();
    this.forma.get("valor").enable();
    this.forma.get("ncf").enable();
    this.cd.detectChanges();
  }

  restaurarFormulario() {
    let i = 0;
    while (0 !== this.cuentas_no.length) {
      this.cuentas_no.removeAt(0);
      i++
    }
    for(var name in this.forma.controls) {        
      if (name !== 'cuentas_no') {            
        (<FormControl>this.forma.controls[name]).setValue('')
        this.forma.controls[name].setErrors(null);          
      }          
    }
    this.totalC = 0;
    this.totalD = 0;    
    this.itbis = 'si';
    this.cuentas = [];  
    this.forma.get('itbis').setValue('si');
    this.forma.get('fecha_orig').setValue('');
    this.forma.get('fecha_proc').setValue('');
    this.forma.get('valor').setValue('');
    this.forma.get('cond_pago').setValue('');
    this.forma.get('monto_itbi').setValue(0);
    this.forma.get('valor_orden').setValue(0);
    this.forma.get('valor_recibido').setValue(0);
    this.forma.get('cuotas').setValue(1);
    this.forma.get('tipo_doc').setValue('FT');
    this.forma.get('bienes').setValue(0);
    this.forma.get('servicios').setValue(0);
    this.forma.get('retencion').setValue(0);
    this.forma.get('estado').setValue('activo');
    this.forma.get('cond_pago').disable()
    this.forma.get('fecha_orig').disable()
    this.forma.get('fecha_proc').disable()
    this.forma.get('valor').disable()
    this.cd.detectChanges();
  }

  calcula() {        
    let index = 0;   
    let bienes = 0;
    let servicios = 0;

    if (this.cuentas.length === 0) {    
      return;
    } else {
      this.forma.get('monto_itbi').setValue(0);

      if (this.itbis == 'si') {        
        let itbis = 0;
        let retencion = 0;

        this.cuentas.forEach(element => {           
          // this.evitaDoble(data, index);
          const porciento = Number(((this.cuentas_no).at(index) as FormGroup).get("porciento").value);
          ((this.cuentas_no).at(0) as FormGroup).get("credito").setValue(this.montoFactura.value);
           
          if (porciento !== 0) {
            itbis = Math.round(this.montoFactura.value - (this.montoFactura.value / ( (porciento/100) + 1) ));    
            if (element.tipo_cuenta === 'impuestos' && element.retencion === 'no') {
              itbis = Number(((this.cuentas_no).at(index) as FormGroup).get("porciento").value);
              this.forma.get('monto_itbi').setValue(itbis);
              ((this.cuentas_no).at(index) as FormGroup).get("debito").setValue(itbis);
            }
             (element.descripcion+'-'+itbis);  
            if (element.tipo_cuenta === 'impuestos' && element.retencion === 'si') {         
              retencion = (porciento / 100) * itbis;
              ((this.cuentas_no).at(index) as FormGroup).get("credito").setValue(retencion);   
            } 
          }else{            
            if (element.tipo_cuenta === 'impuestos' && element.retencion === 'no') {            
              itbis = Number(((this.cuentas_no).at(index) as FormGroup).get("debito").value);
              this.forma.get('monto_itbi').setValue(itbis);
            }
            if (element.tipo_cuenta === 'impuestos' && element.retencion === 'si') {         
              retencion = Number(((this.cuentas_no).at(index) as FormGroup).get("credito").value); 
              ((this.cuentas_no).at(index) as FormGroup).get("debito").disable();           
            } 
          }       
          
          if (element.tipo_cuenta === 'bienes'){     
            let total = Number(((this.cuentas_no).at(index) as FormGroup).get("credito").value) + Number(((this.cuentas_no).at(index) as FormGroup).get("debito").value)      
            bienes += total;
            this.forma.get('bienes').setValue(bienes);    
          }

          if (element.tipo_cuenta === 'servicios'){    
            let total = Number(((this.cuentas_no).at(index) as FormGroup).get("credito").value) + Number(((this.cuentas_no).at(index) as FormGroup).get("debito").value)        
            servicios += total;
            this.forma.get('servicios').setValue(servicios);
          }
          
          this.forma.get('retencion').setValue(retencion);    
          ((this.cuentas_no).at(0) as FormGroup).get("credito").setValue(this.montoFactura.value - retencion);
          index++;          
          this.calculaTotal(this.cuentas_no.value)
        });      
      }      
    }
  }

  evitaDoble(data, index) {
    switch (data) {
      case 'debito':
        ((this.cuentas_no).at(index) as FormGroup).get("credito").setValue('');
        if (((this.cuentas_no).at(index) as FormGroup).get("debito").value !== null) {         
          ((this.cuentas_no).at(index) as FormGroup).get("credito").disable();  
        }else{
          ((this.cuentas_no).at(index) as FormGroup).get("credito").enable();
        }
        break;

      case 'credito':
        ((this.cuentas_no).at(index) as FormGroup).get("debito").setValue('');
        if (((this.cuentas_no).at(index) as FormGroup).get("credito").value !== null) {
          ((this.cuentas_no).at(index) as FormGroup).get("debito").disable();  
        }else{
          ((this.cuentas_no).at(index) as FormGroup).get("debito").enable();
        }
        break;
    
      default:
        break;
    }
  }

  calculaTotal(data) {
    this.totalD = 0;
    this.totalC = 0;
    
    data.forEach((element:any) => {      
      this.totalD += element.debito || 0;        
      this.totalC += element.credito || 0;
    });
    
    return Number(this.totalD) - Number(this.totalC);
  }

  verificaOrdenCompra(data) {        
    if (data === "") {
      this.ocExiste = 3;
      return;
    }
    let index = 0;
    this.ocExiste = 0;
    this.ordenCompraServ.buscaOrdenCompra(data).then((resp: any)=>{      
      if(resp.length !== 0){
        this.ocExiste = 1;          
        this.forma.controls['proveedor'].setValue(this.proveedores.find(proveedor => proveedor.cod_sp === resp[0].cod_sp && 
                                                                        proveedor.cod_sp_sec === resp[0].cod_sp_sec))
        this.forma.controls['valor_recibido'].setValue(resp[0].valor_recibido);
        this.forma.get("fecha_orig").enable();
        this.forma.get("fecha_proc").enable();
        this.forma.get("cond_pago").enable();
        this.forma.get("valor").enable();
        
        const cuentas = resp[0].proveedor.cuentas_proveedor
        cuentas.forEach(element => {
          this.cuentas.push(element);
          this.agregarFormulario(element);
          ((this.cuentas_no).at(index) as FormGroup).get("departamento").setValue(this.departamentos.find(doc => doc.id === element.departamento)); 
          index++;
        });        
      }else{
        this.ocExiste = 2;
        return;
      }
    })
  }

  setVencimiento(data) {    
    if (data === 'prestamo') {
      this.forma.get('cuotas').enable();
    }else{   
      this.forma.get('cuotas').disable();   
      this.vencimiento()
    }
  }

  vencimiento() {
    if (this.forma.get('fecha_orig').value === '') {
      const tiempoTranscurrido = Date.now();
      const hoy = new Date(tiempoTranscurrido);
      this.forma.get('fecha_orig').setValue(hoy);
    }

    const fecha_orig = this.forma.get('fecha_orig').value;
    const vencimiento = this.forma.get('cond_pago').value;
    const tmpDate = new Date(fecha_orig); 
    const now = tmpDate.getTime();
    this.forma.get('fecha_proc').setValue(this.sumarDias(new Date(now),vencimiento.dias));
  }

  setCuotas() { 
    const fecha_orig = this.forma.get('fecha_orig').value;
    const tmpDate = new Date(fecha_orig);     
    const now = tmpDate.getTime();
    const meses = this.forma.get('cuotas').value
    this.forma.get('fecha_proc').setValue(this.sumarMeses(new Date(now),meses));
  }

  sumarDias(fecha, dias){ 
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  sumarMeses(fecha, meses){ 
    fecha.setMonth(fecha.getMonth() + meses);
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

  verificaNCF(event) {
    if (event.length !== 11) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','El NCF debe contener 11 caracteres'); 
      return;
    }
    const proveedor = this.codSp.value+'-'+this.codSpSec.value; 
    
    this.coTransaccionescxpServ.verificaNCF(proveedor, this.ncf.value).then((resp: any) => { 
      if (resp !== null) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Este NCF ya ha ido registrado con este proveedor'); 
        this.ncf.reset();
        return
      }
    })
  }

  buscaCuentas() {
     this.dialogService.open(ListadoCatalogoCuentasComponentsComponent, {
      header: 'Catalogo de cuentas',
      width: '50%'
    });
  }
  
  onSelectDate(fecha) {
    let d = new Date(Date.parse(fecha));
    return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
  }

  borrarCatEscogido(id) {
    this.cuentas.splice(id,1);
    this.cuentas_no.removeAt(id);
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.restaurarFormulario();
    this.coTransaccionescxpServ.guardando();    
  }

  cambiaDivisa(event) {
    this.divisa = event.value.divisa;
    this.simbolo = event.value.simbolo;
  }

  setItbis(data) {   
    this.forma.get('itbis').setValue(data.value);
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
