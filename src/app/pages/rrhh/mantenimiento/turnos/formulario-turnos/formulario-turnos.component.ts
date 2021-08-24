import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { TurnosService } from 'src/app/services/rrhh/turnos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-formulario-turnos',
  templateUrl: './formulario-turnos.component.html',
  styleUrls: ['./formulario-turnos.component.scss'],
  providers:[TurnosService]
})
export class FormularioTurnosComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  
  guardar = true;
  actualizando = false;
  actualizar = false;
  turnoExiste = 3;
  
  id: number;
  listSubscribers: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              
              private datosEstaticos: DatosEstaticosService,
              private turnosServ: TurnosService) { 
                
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.turnosServ.actualizar.subscribe((resp: any) => {
      this.guardar = false;
      this.actualizar = true;
      this.id = Number(resp);
      
      this.turnosServ.getDato(resp).then((res: any) => {
        this.forma.get('descripcion').setValue(res.divisa);
        this.forma.patchValue(res);
      })
    });

    this.listSubscribers = [observer1$];
   };

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:         ['', Validators.required],
      horario_inicial:     ['', Validators.required],
      horario_final:       ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarTurno(){
    //     
    
    let horai =  new Date(Date.parse(this.forma.get('horario_inicial').value));
    let horaf =  new Date(Date.parse(this.forma.get('horario_final').value));
    
    if (this.datosEstaticos.getDiffMilliseconds(horai, horaf) < 0) {
      this.uiMessage.getMiniInfortiveMsg('tst','warn','ATENCION','La hora de salida no puede ser anterior a la de entrada.');     
      this.forma.get('horario_final').setValue('');
      return;
    }

    let hora1 = this.datosEstaticos.getDataFormated(horai);
    let hora2 = this.datosEstaticos.getDataFormated(horaf);

    if (this.forma.invalid) {    
         
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
          this.turnosServ.crearTurno(this.forma.value, hora1, hora2).then(()=>{
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
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
           
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
