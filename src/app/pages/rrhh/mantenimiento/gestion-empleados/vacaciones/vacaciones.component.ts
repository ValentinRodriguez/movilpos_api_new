import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoriasService } from 'src/app/services/inventario/categorias.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
  styleUrls: ['./vacaciones.component.scss'],
  providers:[CategoriasService]
})
export class VacacionesComponent implements OnInit {

  forma: FormGroup; 
  categorias: any[] = [];
  usuario: any;
  guardando = false;
  actualizando = false;
  categoriaExiste = 3;
  actualizar = false;
  id_categoria: any;
  cols: any[];
  minDate: Date;
  
  motivo = [
    { label: 'ninguna', value: 'Ninguna' },
    { label: 'basica', value: 'Basica' },
    { label: 'bachiller', value: 'Bachiller' },
    { label: 'tecnico', value: 'Técnico' },
    { label: 'universitario', value: 'Universitario' },
    { label: 'maestria', value: 'Maestria' },
    { label: 'postgrado', value: 'Postgrado' },
    { label: 'doctorado', value: 'Doctorado' }
  ] 

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,              
              private categoriasServ: CategoriasService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) {                 
                this.crearFormulario();
              }

  ngOnInit(): void {
    this.setMinDate();
    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  crearFormulario() {
    this.forma = this.fb.group({
      fech_ini:     ['', Validators.required],
      hora_ini:     ['', Validators.required],
      fech_fin:     ['', Validators.required],
      hora_fin:     ['', Validators.required],
      total_tiempo: ['', Validators.required],
      motivo:       ['', Validators.required],
      observacion:  ['', Validators.required],
      estado:       ['activo', Validators.required]
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
          this.categoriasServ.crearCategoria(this.forma.value).subscribe((resp: any)=>{
            if (resp.ok) {
              this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');              
            }
          })
          break;
      } 
    }
  }

  actualizarCategoria(categoria) {
    
  }

  borrarCategoria(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.categoriasServ.borrarCategoria(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

  onSelectDate(event, campo:string) {
    let d = new Date(Date.parse(event));
    this.forma.get(campo).setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

  setMinDate() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let day = today.getDate();
    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(year);
    this.minDate.setDate(day);
  }

}
