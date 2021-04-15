import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MonedasService } from 'src/app/services/monedas.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-cotizaciones',
  templateUrl: './formulario-cotizaciones.component.html',
  styleUrls: ['./formulario-cotizaciones.component.scss']
})
export class FormularioCotizacionesComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  monedaExiste = 3;
  formSubmitted = false;
  id: number;
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private monedasServ: MonedasService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnInit(): void {

    this.monedasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.monedasServ.getDato(resp).then((res: any) => {
         
        this.forma.get('divisa').setValue(res.divisa);
        this.forma.get('simbolo').setValue(res.simbolo);
        this.forma.patchValue(res);
      })
    })
  }

  crearFormulario() {
    this.forma = this.fb.group({
      divisa:              ['', Validators.required],
      simbolo:             ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['', Validators.required]
    })
  }

  guardarMoneda(){
    this.formSubmitted = true;    
    if (this.forma.invalid) {       
      this.formSubmitted = false;
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.monedaExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');
          break;

        default:
          this.monedasServ.crearMoneda(this.forma.value).then((resp: any)=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
          })
          break;
      } 
    }
     
  }
  
  verificaMoneda(data){  
    if (data === "") {
      this.monedaExiste = 3;
      return;
    }
    let param = {'monedas': data};
    this.monedaExiste = 0;
    this.monedasServ.busquedaMoneda(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.monedaExiste = 1;
      }else{
        this.monedaExiste = 2;
      }
    })
  }

  actualizarMoneda(){
     this.formSubmitted = true; 
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {      
      this.formSubmitted = false; 
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.monedasServ.actualizarMoneda(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
         
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.monedasServ.guardando();    
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
