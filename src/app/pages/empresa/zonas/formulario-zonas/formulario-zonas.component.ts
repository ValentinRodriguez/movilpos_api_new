import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ZonasService } from 'src/app/services/zonas.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';

@Component({
  selector: 'app-formulario-zonas',
  templateUrl: './formulario-zonas.component.html',
  styleUrls: ['./formulario-zonas.component.scss']
})
export class FormularioZonasComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  cols2: any;
  guardar = true;
  actualizando = false;
  actualizar = false;
  zonaExiste = 3;
  formSubmitted = false;
  id: number;
  listSubscribers: any = [];
  provincias: any[] = [];
  selectedProducts = [];
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private provinciasServ: PaisesCiudadesService,
              private zonasServ: ZonasService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();

    this.provinciasServ.getProvincias().then((resp:any)=>{
      this.provincias = resp;
      console.log(resp);      
    })

    this.cols2 = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descripcion' }
    ] 
  }

  listObserver = () => {
    const observer1$ = this.zonasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.zonasServ.getDato(resp).then((res: any) => {         
        this.forma.get('divisa').setValue(res.divisa);
        this.forma.get('simbolo').setValue(res.simbolo);
        this.forma.patchValue(res);
      })
    })

    const observer2$ = this.zonasServ.formSubmitted.subscribe((resp: any) =>{
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$,observer2$];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:         ['', Validators.required],
      provincias:          [''],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarZona(){
    // this.formSubmitted = true;    
    if (this.forma.invalid) {    
      this.formSubmitted = false;   
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.zonaExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.zonasServ.crearZona(this.forma.value).then(()=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creada de manera correcta'); 
            this.resetFormulario(); 
          })
          break;
      } 
    }
  }
  
  verificaZona(data){  
    if (data === "") {
      this.zonaExiste = 3;
      return;
    }
    let param = {'zona': data};
    this.zonaExiste = 0;
    this.zonasServ.busquedaZona(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.zonaExiste = 1;
      }else{
        this.zonaExiste = 2;
      }
    })
  }

  actualizarZona(){
    this.formSubmitted = true;
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
      this.formSubmitted = false;     
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.zonasServ.actualizarZona(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario();
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.zonasServ.guardando();    
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
