import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriasService } from 'src/app/services/categorias.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-cat',
  templateUrl: './formulario-cat.component.html',
  styleUrls: ['./formulario-cat.component.scss']
})
export class FormularioCatComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  categoriaExiste = 3;
  id: number;
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private categoriasServ: CategoriasService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnInit(): void {
    
    this.categoriasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.categoriasServ.getDato(resp).then((res: any) => {
        console.log(res);
        this.forma.get('descripcion').setValue(res.descripcion);
        this.forma.patchValue(res);
      })
    })
  }

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:     ['', Validators.required],
      estado:          ['activo', Validators.required],
      usuario_creador: [this.usuario.username, Validators.required]
    })
  }

  guardarCategoria(){
    this.guardando = true;
    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.categoriaExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          this.guardando = false;
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');
          this.guardando = false;
          break;

        default:
          this.categoriasServ.crearCategoria(this.forma.value).then((resp: any)=>{
            if (resp) {
              this.guardando = false;
              this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);
              this.forma.get('descripcion').reset();   
            }               
          })
          break;
      } 
    }
  }
  
  ActualizarCategoria(){
    this.actualizando = true;
    this.categoriasServ.actualizarCategoria(this.id, this.forma.value).then((resp: any) => {
      this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);
      this.actualizando = false;
    })
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.categoriasServ.guardando();    
  }
  verificaCategoria(data){  
    if (data === "") {
      this.categoriaExiste = 3;
      return;
    }
    this.categoriaExiste = 0;
    this.categoriasServ.busquedaCategoria(data).then((resp: any)=>{
      if(resp.length === 0) {
        this.categoriaExiste = 1;
      }else{
        this.categoriaExiste = 2;
      }
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
