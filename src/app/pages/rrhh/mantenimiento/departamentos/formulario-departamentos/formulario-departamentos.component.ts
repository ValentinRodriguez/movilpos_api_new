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
  formSubmitted = false;
<<<<<<< HEAD
  guardar = true;
  actualizar = false;
  id: number;
=======
>>>>>>> d3bb0adfcaed5ea642dd14998aade05605bb76fc
  listSubscribers: any = [];
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

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
  }
  
  listObserver = () => {
    const observer1$ = this.departamentoServ.actualizar.subscribe((resp: any) => {
      this.guardar = false;
      this.actualizar = true;
      this.formSubmitted = true;
      this.id = Number(resp);
      this.departamentoServ.getDato(resp).then((res: any) => {
        this.forma.patchValue(res);
      })
    });

    const observer2$ = this.departamentoServ.formSubmitted.subscribe(resp => {
      this.formSubmitted = resp;
    });  

    this.listSubscribers = [observer1$,observer2$];
  };

  listObserver = () => {
    const observer6$ = this.departamentoServ.formSubmitted.subscribe((resp: any) => {
      this.formSubmitted = resp;
    });

    this.listSubscribers = [observer6$];
  
  };

  crearFormulario() {
    this.forma = this.fb.group({
      titulo:           ['', Validators.required],
      tipodepartamento: ['', Validators.required],
      descripcion:      ['', Validators.required],
      estado:           ['activo', Validators.required],
      usuario_creador:  [this.usuario.username, Validators.required]
    })
  }

  guardarDepartamento(){
    this.formSubmitted = true;    
    if (this.forma.invalid) {       
      this.formSubmitted = false;
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
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
          })
          break;
      } 
    }     
  }

  actualizarDepartamento() {
    this.formSubmitted = true;    
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
          this.departamentoServ.actualizarDepartamento(this.id,this.forma.value).then((resp: any)=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
          })
          break;
      } 
    }
  }
  
  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.departamentoServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
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
