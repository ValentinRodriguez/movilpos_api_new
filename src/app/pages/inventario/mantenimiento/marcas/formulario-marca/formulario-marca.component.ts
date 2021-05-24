import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { BrandsService } from 'src/app/services/brands.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-marca',
  templateUrl: './formulario-marca.component.html',
  styleUrls: ['./formulario-marca.component.scss']
})
export class FormularioMarcaComponent implements OnInit {

  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  forma: FormGroup;
  usuario: any;
  marcaExiste = 3;
  id: number;
  formSubmitted = false;
  listSubscribers: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private marcasServ: BrandsService,
              public dialogService: DialogService) { 
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
    const observer1$ =  this.marcasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.marcasServ.getDato(resp).then((res: any) => {         
        this.forma.get('descripcion').setValue(res.descripcion);
        this.forma.patchValue(res);
      })
    })

    const observer5$ = this.marcasServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$,observer5$];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:     ['', Validators.required],
      estado:          ['activo', Validators.required],
      usuario_creador: [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarMarca(){
    this.formSubmitted = true;    
    if (this.forma.invalid) {    
      this.formSubmitted = false;   
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.marcaExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.marcasServ.crearMarca(this.forma.value).then(()=>{            
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
            this.resetFormulario();
          })
          break;
      } 
    }
     
  }

  ActualizarMarca(){
    this.formSubmitted = true;       
    if (this.forma.invalid) {   
      this.formSubmitted = false;    
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{
      switch (this.marcaExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.forma.get('usuario_modificador').setValue(this.usuario.username); 
          this.marcasServ.actualizarMarca(this.id, this.forma.value).then((resp: any) => {
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');             
            this.resetFormulario();
          })
          break;
      }      
    }
     
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;   
    this.resetFormulario();
    this.marcasServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }
  verificaMarca(data){  
    if (data === "") {
      this.marcaExiste = 3;
      return;
    }
    this.marcaExiste = 0;
    this.marcasServ.busquedaMarca(data).then((resp: any)=>{
      if(resp.length === 0) {
        this.marcaExiste = 1;
      }else{
        this.marcaExiste = 2;
      }
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
