import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { MonedasService } from 'src/app/services/monedas.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-tabla-amortizaciones',
  templateUrl: './formulario-tabla-amortizaciones.component.html',
  styleUrls: ['./formulario-tabla-amortizaciones.component.scss']
})
export class FormularioTablaAmortizacionesComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  
  guardar = true;
  actualizando = false;
  actualizar = false;
  monedaExiste = 3;
  formSubmitted = false;
  id: number;
  listSubscribers: any = [];
  cols: any = [];
  dPrestamo: any = [];
  prestamoSeleccionado: any = [];
  today = new Date();
  balance = 0;
  capital = 0;

  sino = [
    {label: 'Sí', value: 'si'},
    {label: 'No', value: 'no'},
  ];
  monto_interes_mensual: number;
  pago_mensual: number;
 
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private monedasServ: MonedasService,
              private datosEst: DatosEstaticosService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();

    this.cols = [
      { field: 'balance', header: 'Saldo' },
      { field: 'pago_mensual', header: 'Pago Mensual' },
      { field: 'capital', header: 'Capital' },
      { field: 'interes', header: 'Interes' },
    ]
  }

  listObserver = () => {
    const observer1$ = this.monedasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.monedasServ.getDato(resp).then((res: any) => {         
        this.forma.get('divisa').setValue(res.divisa);
        this.forma.get('simbolo').setValue(res.simbolo);
        this.forma.patchValue(res);
      })
    })

    const observer2$ = this.monedasServ.formSubmitted.subscribe((resp: any) =>{
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$,observer2$];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      cliente:             ['sdfsdfs', Validators.required],
      monto_inicial:       [''],
      monto_total:         ['100000', Validators.required],
      itbis:               ['si', Validators.required],
      factura:             ['234234234', Validators.required],
      meses:               ['12', Validators.required],
      tasa:                ['6', Validators.required],
      prestamo:            [''],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }
  
  guardarMoneda(){
    this.formSubmitted = true;    
    if (this.forma.invalid) {    
      this.formSubmitted = false;   
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.monedaExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.monedasServ.crearMoneda(this.forma.value).then(()=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creada de manera correcta'); 
            this.resetFormulario(); 
          })
          break;
      } 
    }
  }
  
  verificaMoneda(data){  
    if (data === "") {
      this.monedaExiste = 3;
      return;
    }
    let param = {'monedas': data};
    this.monedaExiste = 0;
    this.monedasServ.busquedaMoneda(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.monedaExiste = 1;
      }else{
        this.monedaExiste = 2;
      }
    })
  }

  actualizarMoneda(){
    this.formSubmitted = true;
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
      this.formSubmitted = false;     
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.monedasServ.actualizarMoneda(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario();
      })
    }
  }

  calcula() {
    const MONTO = this.forma.get('monto_total').value;
    const INTA = this.forma.get('tasa').value;
    const PLAZO = this.forma.get('meses').value;
    this.generar(MONTO,INTA,PLAZO)
  }

  generar(monto, interes, plazo) {
    const fechaActual = this.datosEst.getDate();
    let fecha = new Date(fechaActual);
    const anio = this.today.getFullYear();
    let tempSaldo = Number(this.forma.get('monto_total').value);

    for (let index = 0; index < plazo; index++) {      
      let mesSiguiente = new Date(new Date(fecha).setMonth(fecha.getMonth()+index));
      let ultimoDia = this.obtenerUltimoDia(mesSiguiente.getFullYear(), mesSiguiente.getMonth() + 1);
      let mesConUltimoDia = new Date(`${mesSiguiente.getMonth() + 1} ${ultimoDia} ${mesSiguiente.getFullYear()}`);
      
      this.calculapmt(monto, interes, plazo)
      tempSaldo = tempSaldo - Number(this.capital);
      this.balance = tempSaldo;
      // this.capital = this.forma.get('capital').value;
      
      const obj = {
        balance: this.balance,
        cuota: this.pago_mensual,
        fecha: mesConUltimoDia,
        capital: this.capital,
        interes: this.monto_interes_mensual
      }
      this.dPrestamo.push(obj);
    }  
    console.log(this.dPrestamo);    
  }

  calculapmt(monto_prestamo,inta,plazo) {
    console.log(monto_prestamo,inta,plazo);
    
    let intm = ((inta/100) / 12)+1
    let interesm = (inta/100) / 12
    let p_intm_m1 = Math.pow(intm,plazo) -1;
    let p_intm= Math.pow(intm,plazo)
    let factor = p_intm * interesm
    // let factor1 = factor*interesm
    this.pago_mensual = monto_prestamo/( p_intm_m1/factor)
    this.monto_interes_mensual = monto_prestamo * interesm;
    this.capital = this.pago_mensual - this.monto_interes_mensual
    // console.log(intm, interesm, p_intm_m1, p_intm, factor);

    // return pago_mensual;
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
    this.monedasServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
