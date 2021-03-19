import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CatalogoCuentasComponent } from 'src/app/components/catalogo-cuentas/catalogo-cuentas.component';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { CoTransaccionescxpService } from 'src/app/services/co-transaccionescxp.service';
import { OrdenescomprasService } from 'src/app/services/ordenescompras.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
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

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private coTransaccionescxpServ: CoTransaccionescxpService,
              private ordenCompraServ: OrdenescomprasService,
              private cgCatalogoServ: CgcatalogoService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged()  
                console.log(this.usuario);
                              
                this.crearFormulario();
  }

  ngOnInit(): void {

    this.cols = [
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'depto', header: 'Departamento' },
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

    this.todaLaData();
    this.catalogoEscogido();
    this.setDataActualizar();
  }

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

  setDataActualizar() {
    this.coTransaccionescxpServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);
      this.cuentas = [];
      let index = 0;
      console.log(resp);
      
      this.coTransaccionescxpServ.getDato(this.id).then((res: any) => {
        console.log(res);
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
        this.forma.get('estado').setValue(res.estado)         
        this.forma.get('usuario_creador').setValue(res.usuario_creador)

        res.detalle_factura.forEach(element => {
          this.cuentas.push(element);
          this.agregarFormulario(element);
          ((this.cuentas_no).at(index) as FormGroup).get("departamento").setValue(this.departamentos.find(doc => doc.id === element.departamento)); 
          index++;
        });
      })
    })
  }

  catalogoEscogido() {
    this.cgCatalogoServ.catalogoEscogido.subscribe((resp: any) => {
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
    (<FormArray>this.forma.get('cuentas_no')).push(this.agregarFormularioTransacciones(cuentas));    
  }
  
  agregarFormularioTransacciones(cuentas): FormGroup {
    return this.fb.group({
      tipo_cuenta:     [cuentas.tipo_cuenta, Validators.required],
      fecha:           [''],
      cod_sp:          [''], //
      cod_sp_sec:      [''], //
      debito:          [cuentas.debito || 0, Validators.required],  
      credito:         [cuentas.credito || 0, Validators.required],
      porciento:       [cuentas.porciento || 0, Validators.required],
      factura:         [''], //
      tipo_doc:        [''], //
      cuenta_no:       [cuentas.cuenta_no, Validators.required], 
      departamento:    ['', Validators.required],
      num_doc:         [''], 
      cod_aux:         [''],
      cod_sec:         [''],
      detalles:        [''], //
      tipo_fact:       [''], //
      cod_cia:         [this.usuario.empresa.cod_cia],
      estado:          ['activo'],
      usuario_creador: [this.usuario.username],
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
    this.forma.get('cond_pago').setValue(this.cond_pago.find(doc => doc.cond_pago === event.cond_pago))
    this.forma.get("cod_sp").setValue(event.cod_sp);
    this.forma.get("cod_sp_sec").setValue(event.cod_sp);
    this.forma.get("cod_sp_sec").setValue(event.cod_sp);
    this.forma.get("fecha_orig").enable();
    this.forma.get("fecha_proc").enable();
    this.forma.get("cond_pago").enable();
    this.forma.get("valor").enable();
  }

  autollenado(data) {
    let existe = null;
    
    data.forEach(element => {            
      if (element.length === 0) {
        existe = true;
      }
    });
    if (existe === true) {
      const ref = this.dialogService.open(StepFacturaProvedoresComponent, {
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
      monto_itbi:          ['', Validators.required],
      valor_orden:         [0],
      valor_recibido:      [0],
      tipo_doc:            ['FT', Validators.required],
      cod_sp:              ['', Validators.required],
      cod_sp_sec:          ['', Validators.required],
      moneda:              ['', Validators.required],
      bienes:              [0],
      servicios:           [0],
      retencion:           [0],
      detalle:             [''],
      ncf:                 ['', Validators.required],
      cod_cia:             ['', Validators.required],
      tipo_orden:          [''],
      codigo_fiscal:       ['', Validators.required],
      proveedor:           ['', Validators.required],
      cuentas_no:          this.fb.array([]),
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarFproveedor(){
    //this.guardando = true;
    console.log(this.forma);
    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      const diferencia = this.calculaTotal(this.cuentas_no.value);    
      const montoFactura = Number(this.forma.get('valor').value);
      const total = (this.totalD + this.totalC) / 2;
      const fecha_orig = this.forma.get('fecha_orig').value;
      const fecha_proc = this.forma.get('fecha_proc').value;
    
      this.forma.get('cod_cia').setValue(this.usuario.empresa.cod_cia);
      this.forma.get('fecha_orig').setValue(this.onSelectDate(fecha_orig));
      this.forma.get('fecha_proc').setValue(this.onSelectDate(fecha_proc));

      if (this.cuentas_no.value.length === 0) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','No hay cuentas vinculadas a la transacción.'); 
        return;
      }
      
      if (diferencia !== 0) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','La transaccion no esta cuadrada.'); 
        return;
      }
  
      if (total !== montoFactura) {      
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','La transaccion es mayor al valor de la factura.'); 
        return;
      }
    
      
      this.coTransaccionescxpServ.crearFactura(this.forma.value).then((resp: any)=>{
        this.guardando = false;
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);
      })
    }
  }

  actualizarFactura(){
    //this.actualizando = true;
    console.log(this.forma.value);
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    const fecha_orig = this.forma.get('fecha_orig').value;
    const fecha_proc = this.forma.get('fecha_proc').value;
    this.forma.get('fecha_orig').setValue(this.onSelectDate(fecha_orig));
    this.forma.get('fecha_proc').setValue(this.onSelectDate(fecha_proc));
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
    let index = 0;     
    this.cuentas.forEach(element => {
      if (element.tipo_cuenta === 'impuestos' && element.retencion === 'no') {
        const porciento = Number(element.porciento);
        const itbis = porciento / 100 * Number(data);    
        this.forma.get('monto_itbi').setValue(itbis);
        ((this.cuentas_no).at(index) as FormGroup).get("debito").setValue(itbis); 
        
      }
      if (element.tipo_cuenta === 'impuestos' && element.retencion === 'si') {
        const porciento = Number(element.porciento);
        const itbis = porciento / 100 * Number(data);
        const retencion = porciento / 100 * itbis
        this.forma.get('retencion').setValue(retencion);          
        ((this.cuentas_no).at(index) as FormGroup).get("debito").disable(); 
      }     
      index++;
    });
    this.calculaTotal(this.cuentas_no.value)
  }

  calculaTipo(data, index) {
    const debito =  ((this.cuentas_no).at(index) as FormGroup).get("debito").value;
    const credito =  ((this.cuentas_no).at(index) as FormGroup).get("credito").value;
    
    switch (data.tipo_cuenta) {
      case 'bienes':         
        this.forma.get(data.tipo_cuenta).setValue(this.calculaTotalTipo(this.cuentas_no.value, 'bienes'))
        break;

      case 'servicios':
        this.forma.get(data.tipo_cuenta).setValue(this.calculaTotalTipo(this.cuentas_no.value,'servicios'))
        break;

      default:
        break;
    }
    this.calculaTotal(this.cuentas_no.value);
  }

  calculaTotalTipo(data, tipo) {
    let totalD = 0;
    let totalC = 0;
    
    data.forEach((element:any) => {
      if (element.tipo_cuenta === tipo) {        
        totalD += element.debito;        
        totalC += element.credito;   
      }
    });    
    return Number(totalD) + Number(totalC);
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
      console.log(resp);
      
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

  setVencimiento() {    
    const fecha_orig = this.forma.get('fecha_orig').value;
    const vencimiento = this.forma.get('cond_pago').value;
    
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
  
  onSelectDate(fecha) {
    let d = new Date(Date.parse(fecha));
    return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
  }

  borrarCatEscogido(id) {
    this.cuentas.splice(id,1)  
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('cond_pago').disable()
    this.forma.get('fecha_orig').disable()
    this.forma.get('fecha_proc').disable()
    this.forma.get('valor').disable()
    this.cuentas_no.patchValue([]);

    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.coTransaccionescxpServ.guardando();    
  }

  cambiaDivisa(event) {
    this.divisa = event.value.divisa;
    this.simbolo = event.value.simbolo;
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
