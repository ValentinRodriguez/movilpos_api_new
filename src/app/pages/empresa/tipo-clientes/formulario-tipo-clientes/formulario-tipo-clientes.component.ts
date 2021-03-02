import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoClienteService } from 'src/app/services/tipo-cliente.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-tipo-clientes',
  templateUrl: './formulario-tipo-clientes.component.html',
  styleUrls: ['./formulario-tipo-clientes.component.scss']
})
export class FormularioTipoClientesComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  tipoCliExiste = 3;
  id: number;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private tipoClientesServ: TipoClienteService) { 
              this.usuario = this.usuariosServ.getUserLogged();
                          this.crearFormulario();
            }

  ngOnInit(): void {
    this.tipoClientesServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.tipoClientesServ.getDato(resp).then((res: any) => {
        console.log(res);
        this.forma.get('descripcion').setValue(res.descripcion);
        this.forma.patchValue(res);
      })
    })
  }

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:     ['', Validators.required],
      estado:          ['activo', Validators.required],
      usuario_creador: [this.usuario.username, Validators.required]
    })
  }

  
  actTipoCliente() {
    // this.actualizando = true;
    console.log(this.forma.value);
    if (this.forma.valid) {  
      this.tipoClientesServ.actualizarTipoCliente(this.id, this.forma.value).then((resp: any) => {
        this.actualizando = false;    
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
      })  
    }else{
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      return;
    }
  }

  guardarTipoCliente() {
    if (this.tipoCliExiste === 2) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Este tipo de cliente ya existe');
      return;
    }

    if (this.forma.valid) {      
      this.tipoClientesServ.crearTipoCliente(this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
      })  
    }else{
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      return;
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.tipoClientesServ.guardando();    
  }
  
  verificaTipoCliente(data){
    if (data === "") {
      this.tipoCliExiste = 3;
      return;
    }
    let param = {'descripcion': data};
    this.tipoCliExiste = 0;
    this.tipoClientesServ.busquedaTipo(param).then((resp: any)=>{      console.log(resp);
      
      if(resp.length === 0) {
        this.tipoCliExiste = 1;
      }else{
        this.tipoCliExiste = 2;
      }  
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
