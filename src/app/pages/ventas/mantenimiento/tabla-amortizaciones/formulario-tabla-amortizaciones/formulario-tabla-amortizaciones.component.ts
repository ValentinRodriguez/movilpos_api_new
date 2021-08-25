import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';

import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { ClientesService } from 'src/app/services/ventas/clientes.service';
import { FacturasService } from 'src/app/services/ventas/facturas.service';

@Component({
  selector: 'app-formulario-tabla-amortizaciones',
  templateUrl: './formulario-tabla-amortizaciones.component.html',
  styleUrls: ['./formulario-tabla-amortizaciones.component.scss'],
  providers:[ClientesService,FacturasService]
})
export class FormularioTablaAmortizacionesComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  @ViewChild('op') overlay: OverlayPanel;
  guardar = true;
  actualizando = false;
  actualizar = false;
  
  id: number;
  listSubscribers: any = [];
  cols: any = [];
  detalle_tb: any = [];
  prestamoSeleccionado: any = [];
  today = new Date();
  balance = 0;
  capital = 0;
  clientesFiltrados: any = [];
  monto_interes_mensual: number;
  pago_mensual: number;
  clientes: any = [];

  sino = [
    {label: 'Sí', value: 'si'},
    {label: 'No', value: 'no'},
  ];
  data: any;
 
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,              
              private clientesServ: ClientesService,
              private facturasServ: FacturasService,
              private datosEst: DatosEstaticosService,
              public config: DynamicDialogConfig,
              public ref: DynamicDialogRef) {                
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todosLosClientes();
    this.data = this.config.data;
    this.forma.get('monto_total').setValue(this.data.neto);    
    
    // this.listObserver();

    this.cols = [
      { field: 'balance', header: 'Saldo' },
      { field: 'pago_mensual', header: 'Pago Mensual' },
      { field: 'capital', header: 'Capital' },
      { field: 'interes', header: 'Interes' },
    ]
  }

  todosLosClientes() {
    this.clientesServ.getDatos().then((resp: any) =>{
      this.clientes = resp;
      this.forma.get('cliente').setValue(this.clientes.find(doc => doc.tipo_cliente == this.data.tipo_cliente)); 
    })
  }

  listObserver = () => {
    
  }

  crearFormulario() {
    this.forma = this.fb.group({
      cliente:             ['', Validators.required],
      monto_inicial:       [0],
      monto_total:         [0, Validators.required],
      itbis:               ['si', Validators.required],
      factura:             ['', Validators.required],
      meses:               ['12', Validators.required],
      tasa:                ['6', Validators.required],
      prestamo:            [''],
      estado:              ['activo', Validators.required],
      usuario_modificador: ['']
    })
  }

  actualizarMoneda(){
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
           
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      // this.facturasServ.act(this.id, this.forma.value).then((resp: any) => {
      //   this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
      //   this.resetFormulario();
      // })
    }
  }

  filtrarCliente(event) {
    const filtered: any[] = [];    
    const query = event;
    for (let i = 0; i < this.clientes.length; i++) {
      const size = this.clientes[i];
      
      if (size.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.clientesFiltrados = filtered;
  }

  datosCliente(cliente) {    
    this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente);
    this.forma.get('sec_cliente').setValue(cliente.sec_cliente);
    this.forma.get('nombre_cliente').setValue(cliente.nombre);
    // this.forma.get('direccion_cliente').setValue(cliente.direccion);
    this.forma.get('pais_cliente').setValue(cliente.id_pais);
    this.forma.get('ciudad_cliente').setValue(cliente.id_ciudad);
    this.forma.get('urbanizacion_cliente').setValue(cliente.urbanizacion);
  }

  clienteSeleccionado(cliente) {  
    this.forma.get('cliente').setValue(cliente) 
    this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente)
    this.forma.get('sec_cliente').setValue(cliente.sec_cliente)
    this.overlay.hide()
  }

  calcula() {
    const MONTO = Number(this.forma.get('monto_total').value) - Number(this.forma.get('monto_inicial').value);
    const INTA = this.forma.get('tasa').value;
    const PLAZO = this.forma.get('meses').value;
    const DATA = this.calculapmt(MONTO,INTA,PLAZO);

    setTimeout(() => {
      this.tablaamt(MONTO,DATA.interesm,DATA.pago_mensual,PLAZO);      
    }, 300);
  }

  tablaamt(monto_prestamo,interes_m,pmt,plazos){
    const fechaActual = this.datosEst.getDate();
    let fecha = new Date(fechaActual);

    let xinteres = monto_prestamo*interes_m
    let xcapital =  pmt - xinteres 
    let xsaldo = monto_prestamo - xcapital
    this.detalle_tb = [];

    for (let index = 0; index < plazos; index++) {      
      let mesSiguiente = new Date(new Date(fecha).setMonth(fecha.getMonth()+index));
      let ultimoDia = this.obtenerUltimoDia(mesSiguiente.getFullYear(), mesSiguiente.getMonth() + 1);
      let mesConUltimoDia = new Date(`${mesSiguiente.getMonth() + 1} ${ultimoDia} ${mesSiguiente.getFullYear()}`);

      if (index === 0) {        
        const obj = {
          balance: xsaldo,
          capital: xcapital,
          interes: xinteres,
          cuota: xcapital + xinteres,
          fecha: mesConUltimoDia
        }      
        this.detalle_tb.push(obj);         
      }else{        
        let interes = this.detalle_tb[index - 1].balance * interes_m;
        let capital = pmt - interes;

        const obj = {
          cuota: pmt,
          interes: interes,
          capital: capital,
          balance: this.detalle_tb[index - 1].balance - capital,
          fecha: mesConUltimoDia
        }  
        this.detalle_tb.push(obj);        
      }
    }    
  }

  calculapmt(monto_prestamo,inta,plazo) {    
    let intm = ((inta/100) / 12)+1
    let interesm = (inta/100) / 12
    let p_intm_m1 = Math.pow(intm,plazo) -1;
    let p_intm= Math.pow(intm,plazo)
    let factor = p_intm * interesm
    // let factor1 = factor*interesm
    let pago_mensual = monto_prestamo/( p_intm_m1/factor)
    return {pago_mensual, interesm};
  }

  enviarDataFacturar() {
    this.forma.get('prestamo').setValue(this.detalle_tb);
    this.facturasServ.enviarData(this.forma.value);
    this.ref.close();
  }

  onRowSelect(data, dt) {

  }

  obtenerUltimoDia(anio, mes) {
    var ultimoDia = new Date(anio, mes, 0);
    return ultimoDia.getDate();
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    // this.facturasServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
