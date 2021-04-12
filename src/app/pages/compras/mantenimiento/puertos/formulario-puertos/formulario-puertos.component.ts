import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PuertosService } from 'src/app/services/puertos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-puertos',
  templateUrl: './formulario-puertos.component.html',
  styleUrls: ['./formulario-puertos.component.scss']
})
export class FormularioPuertosComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  puertoExiste = 3;
  formSubmitted = false;
  listSubscribers: any = [];
  id: number;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private puertosServ: PuertosService) { 
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
    const observer1$ = this.puertosServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.puertosServ.getDato(resp).then((res: any) => {
        this.forma.patchValue(res);
      })
    })

    const observer5$ = this.puertosServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$,observer5$];
  };
  
  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:         ['', Validators.required],
      dias:                ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarPuerto(){
    this.formSubmitted = true;
    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.puertoExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.puertosServ.crearPuerto(this.forma.value).then((resp: any)=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
            this.resetFormulario();
          })
          break;
      } 
    }
     
  }
  
  verificaPuerto(data){  
    if (data === "") {
      this.puertoExiste = 3;
      return;
    }
    let param = {'puertos': data};
    this.puertoExiste = 0;
    this.puertosServ.busquedaPuerto(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.puertoExiste = 1;
      }else{
        this.puertoExiste = 2;
      }
    })
  }

  actualizarPuerto(){
    this.formSubmitted = true; 
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.puertosServ.actualizarPuerto(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario() ;
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.puertosServ.guardando();    
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
