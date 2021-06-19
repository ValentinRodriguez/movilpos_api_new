import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MonedasService } from 'src/app/services/monedas.service';
import { PuestosService } from 'src/app/services/puestos.service';
import { RrhhService } from 'src/app/services/rrhh.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-cuadre-caja',
  templateUrl: './formulario-cuadre-caja.component.html',
  styleUrls: ['./formulario-cuadre-caja.component.scss']
})
export class FormularioCuadreCajaComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  minDate: Date;
  guardar = true;
  actualizando = false;
  actualizar = false;
  monedaExiste = 3;
  formSubmitted = false;
  id: number;
  listSubscribers: any = [];
  denominaciones: any = [];
  totalBilletes: number;
  totalRecibido: number;
  saldoActual: number;
  saldoFinal: number;
  saldoInicial: number;
  puestos: any;
  cajeros: any;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private monedasServ: MonedasService,
              private empleadosServ: RrhhService,
              private puestosServ: PuestosService) {
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
    this.puestosServ.getDatos().then((resp: any) => {
      this.puestos = resp;      
    })

    this.empleadosServ.getCajeros().then((resp: any) => {
      this.cajeros = resp;
    })

    this.denominaciones = [
      { denominacion: '$.0', valor: 0, cantidad: 0, total: 0 },
      { denominacion: '$1', valor: 1, cantidad: 0, total: 0 },
      { denominacion: '$5', valor: 5, cantidad: 0, total: 0 },
      { denominacion: '$10', valor: 10, cantidad: 0, total: 0 },
      { denominacion: '$25', valor: 25, cantidad: 0, total: 0 },
      { denominacion: '$50', valor: 50, cantidad: 0, total: 0 },
      { denominacion: '$100', valor: 100, cantidad: 0, total: 0 },
      { denominacion: '$200', valor: 200, cantidad: 0, total: 0 },
      { denominacion: '$500', valor: 500, cantidad: 0, total: 0 },
      { denominacion: '$1000', valor: 1000, cantidad: 0, total: 0 },
      { denominacion: '$2000', valor: 2000, cantidad: 0, total: 0 },      
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
      fecha:               ['', Validators.required],
      importeEntrega:      ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarMoneda() {    
    // this.formSubmitted = true;    
    // if (this.forma.invalid) {    
    //   this.formSubmitted = false;   
    //   this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
    //   Object.values(this.forma.controls).forEach(control =>{          
    //     control.markAllAsTouched();
    //   })
    // }else{   
    //   switch (this.monedaExiste) {
    //     case 0:
    //       this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
    //       break;

    //     case 2:
    //       this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
    //       break;

    //     default:
    //       this.monedasServ.crearMoneda(this.forma.value).then(()=>{
    //         this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creada de manera correcta'); 
    //         this.resetFormulario(); 
    //       })
    //       break;
    //   } 
    // }
  }
  
  calculaDeno(event, campo, index) {
    if (event.value !== null) {
      if (campo.valor === 0) {
        this.denominaciones[index].total = campo.cantidad;
      } else {
        this.denominaciones[index].total = campo.cantidad * campo.valor;        
      }
      this.calcularTotal();           
    }
  }

  calcularTotal() {
    this.totalBilletes = 0;
    this.totalRecibido = 0;
    this.denominaciones.forEach(element => {
      if (element.valor === 0) {
        this.totalRecibido += (element.cantidad / 100);       
      } else {
        this.totalBilletes += element.cantidad;
        this.totalRecibido += element.total;        
      }
      this.forma.get('importeEntrega').setValue(this.totalRecibido);
    });
  }

  onSelectDate(event) {
    let d = new Date(Date.parse(event));
    this.forma.get("fecha_enviada").setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
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
