import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoNegocioService } from 'src/app/services/mi-empresa/tipo-negocio.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

@Component({
  selector: 'app-formulario-tiponegocio',
  templateUrl: './formulario-tiponegocio.component.html',
  styleUrls: ['./formulario-tiponegocio.component.scss'],
  providers:[UsuarioService,TipoNegocioService]
})
export class FormularioTiponegocioComponent implements OnInit {

  forma: FormGroup;
  negocioExiste = 3;
  usuario: any;
  guardar = true;
  guardando = false;
  actualizar = false;
  actualizando = false;
  id: number;  
  listSubscribers: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private tipoNegocioServ: TipoNegocioService) { 
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
    const observer1$ = this.tipoNegocioServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);  
      this.tipoNegocioServ.getDato(resp).then((res: any) => {         
        this.forma.get('descripcion').setValue(res.descripcion);
      })
    })

    this.listSubscribers = [observer1$];
  };
 
  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:         ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarTipoNegocio() {
    if (this.negocioExiste === 2) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Este tipo de negocio ya existe');
      return;
    }

    if (this.negocioExiste === 0) {
      this.uiMessage.getMiniInfortiveMsg('tst','info','Atención','Verificando disponibilidad de nombre');
      return;
    }

    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      return;
    }else{
      this.tipoNegocioServ.crearTipoNegocio(this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
        this.resetFormulario();
      })
    }
  }

  actTipoNegocio() {
    if (this.forma.valid) {  
      this.forma.get('usuario_modificador').setValue(this.usuario.username);
      this.tipoNegocioServ.actualizarTipoNegocio(this.id, this.forma.value).then((resp: any) => {             
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario();
      })  
    }else{
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      return;
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.tipoNegocioServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }
  verificaTipoNegocio(data){
    if (data === "") {
      this.negocioExiste = 3;
      return;
    }

    this.negocioExiste = 0;
    this.tipoNegocioServ.busquedaTipoN(data).then((resp: any)=>{
      if(resp.length === 0) {
        this.negocioExiste = 1;
      }else{
        this.negocioExiste = 2;
      }  
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
