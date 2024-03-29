import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PuestosService } from 'src/app/services/rrhh/puestos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-formulario-puestos',
  templateUrl: './formulario-puestos.component.html',
  styleUrls: ['./formulario-puestos.component.scss'],
  providers:[PuestosService]
})
export class FormularioPuestosComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  puestoExiste = 3;  
  id: number; 
  
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              
              private puestosServ: PuestosService) { 
                
                this.crearFormulario();
  }

  ngOnInit(): void {

    this.puestosServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.puestosServ.getDato(resp).then((res: any) => {         
        this.forma.patchValue(res);
      })
    })
  }

  crearFormulario() {
    this.forma = this.fb.group({
      titulo:              ['', Validators.required],
      descripcion:         ['', Validators.required],
      sueldo_inicial:      ['', Validators.required],
      sueldo_actual:       [''],
      estado:              ['activo', Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarPuesto(){
        
    if (this.forma.invalid) {    
         
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.puestoExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');
          break;

        default:
          this.puestosServ.crearPuesto(this.forma.value).then((resp: any)=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
            this.resetFormulario();
          })
          break;
      } 
    }
     
  }
  
  verificaPuesto(data){  
    if (data === "") {
      this.puestoExiste = 3;
      return;
    }
    let param = {'puesto': data};
    this.puestoExiste = 0;
    this.puestosServ.busquedaPuesto(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.puestoExiste = 1;
      }else{
        this.puestoExiste = 2;
      }
    })
  }

  actualizarPuesto(){
      
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {     
        
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.puestosServ.actualizarPuesto(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
         
        this.resetFormulario();
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.puestosServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    
  }
  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
