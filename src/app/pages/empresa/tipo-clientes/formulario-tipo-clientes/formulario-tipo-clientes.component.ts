import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoClienteService } from 'src/app/services/mi-empresa/tipo-cliente.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-formulario-tipo-clientes',
  templateUrl: './formulario-tipo-clientes.component.html',
  styleUrls: ['./formulario-tipo-clientes.component.scss'],
  providers:[TipoClienteService]
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
  listSubscribers: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              
              private tipoClientesServ: TipoClienteService) { 
              ;
                          this.crearFormulario();
            }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.tipoClientesServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.tipoClientesServ.getDato(resp).then((res: any) => {         
        this.forma.get('descripcion').setValue(res.descripcion);
        this.forma.patchValue(res);
      })
    })

    this.listSubscribers = [observer1$];
   };

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:     ['', Validators.required],
      estado:          ['activo', Validators.required]
    })
  }
  
  actTipoCliente() {
    if (this.forma.valid) {  
      this.tipoClientesServ.actualizarTipoCliente(this.id, this.forma.value).then((resp: any) => {             
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
      })  
    }else{
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      return;
    }
  }

  guardarTipoCliente() {
    if (this.tipoCliExiste === 2) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Este tipo de cliente ya existe');       
      return;
    }

    if (this.tipoCliExiste === 0) {
      this.uiMessage.getMiniInfortiveMsg('tst','info','Atención','Verificando disponibilidad de nombre');
      return;
    }

    if (this.forma.valid) {  
      this.tipoClientesServ.crearTipoCliente(this.forma.value).then(() => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
        this.reset();
      })  
    }else{
        
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      return;
    }
  }

  reset() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.reset();
    this.tipoClientesServ.guardando();    
  }
  
  verificaTipoCliente(data){
    if (data === "") {
      this.tipoCliExiste = 3;
      return;
    }
    let param = {'descripcion': data};
    this.tipoCliExiste = 0;
    this.tipoClientesServ.busquedaTipo(param).then((resp: any)=>{             
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
