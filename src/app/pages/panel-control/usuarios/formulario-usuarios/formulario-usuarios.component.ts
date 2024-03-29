import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ListadoEmpleadosComponent } from 'src/app/components/listado-empleados/listado-empleados.component';
import { PuestosService } from 'src/app/services/rrhh/puestos.service';
import { RrhhService } from 'src/app/services/rrhh/rrhh.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';


@Component({
  selector: 'app-formulario-usuarios',
  templateUrl: './formulario-usuarios.component.html',
  styleUrls: ['./formulario-usuarios.component.scss'],
  providers:[PuestosService,RrhhService]
})
export class FormularioUsuariosComponent implements OnInit {

  forma: FormGroup;
  @Input() empleados: any; 
  usuarioExiste = 3;
  emailExiste = 3;
  imgURLUser = null;
  imgUser = null;
  usuario: any;
  message: string;
  imagePathUser;
  puestos = [];
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  
  id: number;
  listSubscribers: any = [];
  estado = [
    {label: 'Activo', value: 'activo'},
    {label: 'Inactivo', value: 'inactivo'},
  ];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,              
              private puestosServ: PuestosService,
              private empleadosServ: RrhhService,
              private usuariosServ: UsuarioService,
              public dialogService: DialogService) {                 
                this.crearFormulario();
              }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();    
    this.puestosServ.getDatos().then((resp: any) => {
      this.puestos = resp;      
    })
  }

  listObserver = () => {
    const observer1$ = this.usuariosServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.usuariosServ.getUser(resp).subscribe((res: any) => {
        const password = this.forma.get('password');
        const password_confirmation = this.forma.get('password_confirmation');
        this.imgUser = res.img;
        password.clearValidators();   
        password_confirmation.clearValidators(); 
        password.updateValueAndValidity
        password_confirmation.updateValueAndValidity    

        this.forma.patchValue(res);
      })
    })

    const observer3$ = this.empleadosServ.empleadoEscogido.subscribe(resp =>{
      this.forma.get('name').setValue((resp.primernombre));
      this.forma.get('surname').setValue(resp.primerapellido);
      this.forma.get('email').setValue(resp.email);
      this.forma.get('id').setValue(resp.id);
    })

    this.listSubscribers = [observer1$,observer3$];
   };

   
  crearFormulario() {
    this.forma = this.fb.group({
      name:                  ['', Validators.required],
      surname:               ['', Validators.required],
      username:              ['', Validators.required],
      email:                 ['', Validators.required],
      id:             ['', Validators.required],
      password:              [, Validators.required],
      password_confirmation: [, Validators.required],
      estado:                ['activo', Validators.required],
      impresora:             ['', Validators.required],
      usuario_modificador:   [''],
      img:                  []
    })
  }

  guardarUsuario() {
    if (this.usuarioExiste === 2) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Este usuario ya esta registrado');
      return;
    }

    if (this.emailExiste === 2) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Este email ya esta registrado');
      return;
    }

    if (this.forma.valid) {      
      if (this.imgURLUser === null) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe escoger una imagen');
        return;
      } else {
        this.usuariosServ.register(this.forma.value).subscribe(() => {  
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
          this.resetFormulario();
        })  
      }
    }else{
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control =>{ 
        control.markAllAsTouched();
      })
      return;
    }
  }

  actualizarUsuario() {
      
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {     
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.usuariosServ.actUsuario(this.id, this.forma.value).subscribe((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
         
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    const password = this.forma.get('password');
    const password_confirmation = this.forma.get('password_confirmation');
    password.setValidators(Validators.required) 
    password_confirmation.setValidators(Validators.required) 
    password.updateValueAndValidity
    password_confirmation.updateValueAndValidity   
    this.usuariosServ.guardando();    
  }

  resetFormulario() {
    this.imgUser = null;
    this.imgURLUser = null;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    
  }
  verificaUsuario(data){  
    if (data === "") {
      this.usuarioExiste = 3;
      return;
    }
    let param = {'username': data};
    this.usuarioExiste = 0;
    this.usuariosServ.busquedaUsername(param).subscribe((resp: any)=>{
      if(resp.length === 0) {
        this.usuarioExiste = 1;
      }else{
        this.usuarioExiste = 2;
      }
    })
  }

  verificaEmail(data){  
    if (data === "") {
      this.emailExiste = 3;
      return;
    }
    let param = {'email': data};
    this.emailExiste = 0;
    this.usuariosServ.busquedaEmail(param).subscribe((resp: any)=>{
      if(resp.length === 0) {
        this.emailExiste = 1;
      }else{
        this.emailExiste = 2;
      }
    })
  }

  listadoEmpleados(data) {
    setTimeout(() => {
      if (data === 1) {
         this.dialogService.open(ListadoEmpleadosComponent, {
          header: 'Listado de empleados',
          width: '50%'
        });      
      }
    }, 300);
  }

  previewUserPhoto(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Solo puede escoger imagenes";
      return;
    }

    this.forma.controls['img'].setValue(files[0])
    
    var reader = new FileReader();
    this.imagePathUser = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURLUser = reader.result;       
    }
  }

  passWordDiferente() {
    const pass1 = this.forma.get('password')
    const pass2 = this.forma.get('password_confirmation')

    if ((pass1 !== pass2)) {
      return true;      
    } else {
      return false;
    }
  }

  submitted() {
    
  }

  passwordsIguales(pass1Name: string, pass2Name: string ) {

    return ( formGroup: FormGroup ) => {

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors(null)
        pass1Control.setErrors(null)
      } else {
        pass2Control.setErrors({ noEsIgual: true })
        pass1Control.setErrors({ noEsIgual: true })
      }
    }
  }  

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
