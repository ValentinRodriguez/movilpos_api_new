import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MonedasService } from 'src/app/services/mi-empresa/monedas.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-formulario-monedas',
  templateUrl: './formulario-monedas.component.html',
  styleUrls: ['./formulario-monedas.component.scss'],
  providers:[MonedasService]
})
export class FormularioMonedasComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  
  guardar = true;
  actualizando = false;
  actualizar = false;
  monedaExiste = 3;
  
  id: number;
  listSubscribers: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              
              private monedasServ: MonedasService) { 
                
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.monedasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.monedasServ.getDato(resp).then((res: any) => {         
        this.forma.get('divisa').setValue(res.divisa);
        this.forma.get('simbolo').setValue(res.simbolo);
        this.forma.patchValue(res);
      })
    })
    this.listSubscribers = [observer1$];
   };

  crearFormulario() {
    this.forma = this.fb.group({
      divisa:              ['', Validators.required],
      descripcion:         ['', Validators.required],
      simbolo:             ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarMoneda(){
        
    if (this.forma.invalid) {    
         
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
          this.monedasServ.crearMoneda(this.forma.value).then(()=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creada de manera correcta'); 
            this.resetFormulario(); 
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
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
           
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.monedasServ.actualizarMoneda(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario();
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.monedasServ.guardando();    
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
