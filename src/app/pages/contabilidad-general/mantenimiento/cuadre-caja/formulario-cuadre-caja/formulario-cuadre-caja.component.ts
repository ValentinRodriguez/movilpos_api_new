import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MonedasService } from 'src/app/services/monedas.service';
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
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private monedasServ: MonedasService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
    this.denominaciones = [
      { denominacion: '$.0', cantidad: '', total: '' },
      { denominacion: '$1', cantidad: '', total: '' },
      { denominacion: '$5', cantidad: '', total: '' },
      { denominacion: '$10', cantidad: '', total: '' },
      { denominacion: '$25', cantidad: '', total: '' },
      { denominacion: '$50', cantidad: '', total: '' },
      { denominacion: '$100', cantidad: '', total: '' },
      { denominacion: '$200', cantidad: '', total: '' },
      { denominacion: '$500', cantidad: '', total: '' },
      { denominacion: '$1000', cantidad: '', total: '' },
      { denominacion: '$2000', cantidad: '', total: '' },      
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
      fecha: ['', Validators.required],
      
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarMoneda() {
    console.log(this.denominaciones);
    
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
