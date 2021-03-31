import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-departamentos',
  templateUrl: './formulario-departamentos.component.html',
  styleUrls: ['./formulario-departamentos.component.scss']
})
export class FormularioDepartamentosComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  deptoExiste = 3;

  tipo = [
    {label: 'Producción', value: 'produccion'},
    {label: 'Administración', value: 'administracion'},
  ];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private departamentoServ: DepartamentosService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.crearFormulario();
  }

  ngOnInit(): void {
  }

  crearFormulario() {
    this.forma = this.fb.group({
      titulo:           ['tecnologia', Validators.required],
      tipodepartamento: ['', Validators.required],
      descripcion:      ['test', Validators.required],
      estado:           ['activo', Validators.required],
      usuario_creador:  [this.usuario.username, Validators.required]
    })
  }

  guardarDepartamento(){
    this.guardando = true;    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.deptoExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.departamentoServ.crearDepartamento(this.forma.value).then((resp: any)=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);
          })
          break;
      } 
    }
    this.guardando = false;
  }
  
  verificaDepartamento(data){  
    if (data === "") {
      this.deptoExiste = 3;
      return;
    }
    let param = {'departamento': data};
    this.deptoExiste = 0;
    this.departamentoServ.busqueda(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.deptoExiste = 1;
      }else{
        this.deptoExiste = 2;
      }
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
