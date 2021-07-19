import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { TipoInventarioService } from 'src/app/services/tipo-inventario.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-formulario-tipoinv',
  templateUrl: './formulario-tipoinv.component.html',
  styleUrls: ['./formulario-tipoinv.component.scss']
})
export class FormularioTipoinvComponent implements OnInit {

  forma: FormGroup;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  tipoInvExiste = 3;
  usuario: any;
  cuenta_no: any;
  cuentasFiltradas: any[] = [];
  id: number;
    
  listSubscribers: any = [];

  constructor(private globalFunction: GlobalFunctionsService,private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private tipoInventarioServ: TipoInventarioService,
              private usuariosServ: UsuarioService,
              private cgcatalogoServ: CgcatalogoService) {
                this.usuario = this.usuariosServ.getUserLogged();
                this.crearFormulario();
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
    this.cgcatalogoServ.getDatosAux().then((resp: any) => {
      this.cuenta_no = resp;
    })
  }

  listObserver = () => {
    const observer1$ = this.tipoInventarioServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.tipoInventarioServ.getDato(resp).then((res: any) => {         
        this.forma.get('descripcion').setValue(res.descripcion);
        this.forma.get('cuenta_no').setValue(this.cuenta_no.find(cuenta => cuenta.cuenta_no === res.cuenta_no));
      })
    })

    this.listSubscribers = [observer1$];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:         ['', Validators.required],
      cuenta_no:           ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }
  
  guardarTipoInventario(){
        
    if (this.forma.invalid) { 
            
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.tipoInvExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.tipoInventarioServ.crearTipoInventario(this.forma.value).then((resp: any)=>{            
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');  
            this.resetFormulario();
          })
          break;
      } 
    }
  }

  
  ActualizarTipoInv(){
    // this.actualizando = true
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{      
      switch (this.tipoInvExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');
          break;

        default:
          this.forma.get('usuario_modificador').setValue(this.usuario.username);
          this.tipoInventarioServ.actualizartipoInv(this.id, this.forma.value).then((resp: any) => {
             
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
    this.tipoInventarioServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }

  verificaTipoInv(data){  
    if (data === "") {
      this.tipoInvExiste = 3;
      return;
    }
    let param = {'invtipo': data};
    this.tipoInvExiste = 0;
    this.tipoInventarioServ.busquedaTipoInv(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.tipoInvExiste = 1;
      }else{
        this.tipoInvExiste = 2;
      }
    })
  }

  filtrarCuentas(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.cuenta_no.length; i++) {
      const size = this.cuenta_no[i];
      if (size.descripcion.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.cuentasFiltradas = filtered;
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
