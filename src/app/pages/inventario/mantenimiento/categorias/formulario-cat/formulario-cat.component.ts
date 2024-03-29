import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriasService } from 'src/app/services/inventario/categorias.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-formulario-cat',
  templateUrl: './formulario-cat.component.html',
  styleUrls: ['./formulario-cat.component.scss'],
  providers:[CategoriasService]
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
  listSubscribers: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,              
              private categoriasServ: CategoriasService) {                 
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.categoriasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.categoriasServ.getDato(resp).subscribe((res: any) => {         
        if (resp.ok) {
          this.forma.get('descripcion').setValue(res.descripcion);
          this.forma.patchValue(res);          
        }
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

  guardarCategoria(){        
    if (this.forma.invalid) {             
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.categoriaExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          if (this.actualizar) {
            console.log('actualizando');
            
            this.categoriasServ.actualizarCategoria(this.id, this.forma.value).subscribe((resp: any) => {
              if (resp.ok) {
                this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');       
                this.forma.get('descripcion').reset();      
                this.categoriasServ.categoriaActualizada.emit(true);          
              }
            })
          } else {
            console.log('guardando');
            this.categoriasServ.crearCategoria(this.forma.value).subscribe((resp: any)=>{
              console.log(resp);
              if (resp.ok) {
                this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
                this.forma.get('descripcion').reset();   
                this.categoriasServ.categoriaGuardada.emit(true);
              }
            })            
          }
          break;
      } 
    }
  }
  
  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    
    this.categoriasServ.guardando();    
  }
  
  verificaCategoria(data){  
    if (data === "") {
      this.categoriaExiste = 3;
      return;
    }
    this.categoriaExiste = 0;
    this.categoriasServ.busquedaCategoria(data).subscribe((resp: any)=>{
      console.log(resp.data);
      
      if (resp.ok) {
        if(resp.data.length === 0) {
          this.categoriaExiste = 1;
        }else{
          this.categoriaExiste = 2;
        }        
      }
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
