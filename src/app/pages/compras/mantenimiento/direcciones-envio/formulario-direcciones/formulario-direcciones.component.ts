import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-direcciones',
  templateUrl: './formulario-direcciones.component.html',
  styleUrls: ['./formulario-direcciones.component.scss']
})
export class FormularioDireccionesComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  direccionesExiste = 3;
  ciudades=[];
  paises=[]; 
  id: number;
  listSubscribers: any = [];
  formSubmitted = false;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private paisesCiudadesServ: PaisesCiudadesService,
              private dirServ: DireccionesService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();

    this.paisesCiudadesServ.getPaises().then((resp: any) => {
      this.paises = resp;
    })
  } 
   
  listObserver = () => {
    const observer1$ = this.dirServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.dirServ.getDato(resp).then((res: any) => {
        this.forma.patchValue(res);
      })
    })

    const observer2$ = this.dirServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$,observer2$];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      nombre:              ['', Validators.required],
      direccion_a:         ['', Validators.required],
      direccion_b:         ['', Validators.required],
      id_pais:             ['', Validators.required],
      id_ciudad:           ['', Validators.required],
      telefono:            ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarDirecciones(){
    this.formSubmitted = true;    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.direccionesExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');                           
          break;
   
        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');
          break;

        default:
          this.dirServ.crearDireccion(this.forma.value).then((resp: any)=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);  
          })
          break;
      } 
    }
     
  }
  
  verificaDirecciones(data){  
    if (data === "") {
      this.direccionesExiste = 3;
      return;
    }
    let param = {'direccioness': data};
    this.direccionesExiste = 0;
    this.dirServ.busquedaDireccion(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.direccionesExiste = 1;
      }else{
        this.direccionesExiste = 2;
      }
    })
  }

  actualizarDirecciones(){
    this.formSubmitted = true; 
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.dirServ.actualizarDireccion(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);
         
      })
    }
  }

  buscaPaises(id) {    
    this.paisesCiudadesServ.getCiudadesXpaises(id).then((resp:any) => {
      this.ciudades = resp;     
    })  
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.dirServ.guardando();    
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
