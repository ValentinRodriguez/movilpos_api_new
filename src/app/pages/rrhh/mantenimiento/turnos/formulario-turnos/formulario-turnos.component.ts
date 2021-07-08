import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-turnos',
  templateUrl: './formulario-turnos.component.html',
  styleUrls: ['./formulario-turnos.component.scss']
})
export class FormularioTurnosComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  
  guardar = true;
  actualizando = false;
  actualizar = false;
  turnoExiste = 3;
  formSubmitted = false;
  id: number;
  listSubscribers: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private datosEstaticos: DatosEstaticosService,
              private turnosServ: TurnosService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.turnosServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      console.log(resp);
      this.turnosServ.getDato(resp).then((res: any) => {         
        this.forma.get('descripcion').setValue(res.divisa);
        this.forma.patchValue(res);
      })
    })

    const observer2$ = this.turnosServ.formSubmitted.subscribe((resp: any) =>{
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$,observer2$];
   };

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:         ['', Validators.required],
      horario_inicial:     ['', Validators.required],
      horario_final:       ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarTurno(){
    this.formSubmitted = true;    
    console.log(this.forma.value);

    const horai =  this.datosEstaticos.getDateTimeFormated(this.forma.get('horario_inicial').value);
    const horaf =  this.datosEstaticos.getDateTimeFormated(this.forma.get('horario_final').value); 
    
    console.log(horai);
    console.log(horaf);

    // if (horai > horaf) {
    //   this.uiMessage.getMiniInfortiveMsg('tst','warn','ATENCION','La hora de salida no puede ser anterior a la de entrada.');     
    //   return;
    // }

    if (this.forma.invalid) {    
      this.formSubmitted = false;   
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.turnoExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.turnosServ.crearTurno(this.forma.value, horai, horaf).then(()=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creada de manera correcta'); 
            this.resetFormulario(); 
          })
          break;
      } 
    }
  }
  
  verificaTurno(data){  
    if (data === "") {
      this.turnoExiste = 3;
      return;
    }
    let param = {'turnos': data};
    this.turnoExiste = 0;
    this.turnosServ.busquedaTurno(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.turnoExiste = 1;
      }else{
        this.turnoExiste = 2;
      }
    })
  }

  actualizarTurno(){
    this.formSubmitted = true;
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
      this.formSubmitted = false;     
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.turnosServ.actualizarTurno(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario();
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.turnosServ.guardando();    
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
