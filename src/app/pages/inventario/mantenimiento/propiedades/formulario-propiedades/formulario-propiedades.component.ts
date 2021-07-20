import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PropiedadesService } from 'src/app/services/inventario/propiedades.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-formulario-propiedades',
  templateUrl: './formulario-propiedades.component.html',
  styleUrls: ['./formulario-propiedades.component.scss']
})
export class FormularioPropiedadesComponent implements OnInit {
  
  forma: FormGroup;
  usuario: any;
  guardando = false;
  propiedadExiste = 3;
  
  guardar = true;
  actualizar = false;
  listSubscribers: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private propiedadServ: PropiedadesService) { 
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
    this.listSubscribers = [];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:     ['', Validators.required],
      estado:          ['activo', Validators.required],
      usuario_creador: [this.usuario.username, Validators.required]
    })
  }

  guardarPropiedad(){
        
    if (this.forma.invalid) {     
        
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.propiedadExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una propiedad con este nombre');          
          break;

        default:
          this.propiedadServ.crearPropiedad(this.forma.value).then((resp: any)=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
            this.forma.get('descripcion').reset();
          })
          break;
      } 
    }
     
  }
  
  verificaPropiedad(data){  
    if (data === "") {
      this.propiedadExiste = 3;
      return;
    }
    let param = {'propiedad': data};
    this.propiedadExiste = 0;
    this.propiedadServ.busquedaPropiedad(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.propiedadExiste = 1;
      }else{
        this.propiedadExiste = 2;
      }
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
