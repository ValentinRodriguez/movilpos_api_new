import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CondicionesPagoService } from 'src/app/services/condiciones-pago.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-condiciones',
  templateUrl: './formulario-condiciones.component.html',
  styleUrls: ['./formulario-condiciones.component.scss']
})
export class FormularioCondicionesComponent implements OnInit {

  forma: FormGroup;
  guardando = false;
  condicionExiste = 3;
  usuario: any;
  
  sino = [
    {label: 'Sí', value: 'si'},
    {label: 'No', value: 'no'},
  ];
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private condicionServ: CondicionesPagoService,) { 
    this.usuario = this.usuariosServ.getUserLogged()
    this.crearFormulario();
  }

  ngOnInit(): void {
  }

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:     ['', Validators.required],
      defecto:         ['', Validators.required],
      dias:            ['', Validators.required],
      estado:          ['activo', Validators.required],
      usuario_creador: [this.usuario.username, Validators.required]
    })
  }

  guardarCondicion() {
    if (this.condicionExiste === 2) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Esta condición ya existe');
      return;
    }

    if (this.condicionExiste === 0) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Verificando disponibilidad de nombre');
      return;
    }

    if (this.forma.valid) {  
      this.condicionServ.crearCondicion(this.forma.value).then((resp: any) => {        
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
      })
    }else{
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      return;
    }
  }

  verificaCondicion(data){
    if (data === "") {
      this.condicionExiste = 3;
      return;
    }
    let param = {'condicion': data};
    this.condicionExiste = 0;
    this.condicionServ.busquedacondicion(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.condicionExiste = 1;
      }else{
        this.condicionExiste = 2;
      }  
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
