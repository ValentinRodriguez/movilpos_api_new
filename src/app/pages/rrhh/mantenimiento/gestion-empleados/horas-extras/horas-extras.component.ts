import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoriasService } from 'src/app/services/categorias.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrls: ['./horas-extras.component.scss']
})
export class HorasExtrasComponent implements OnInit {

  forma: FormGroup;
 
  departamento: any[] = [];
  empleados: any[] = [];
  usuario: any;
  guardando = false;
  actualizando = false;
  empleadoFiltrados: any[];
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

  constructor(private globalFunction: GlobalFunctionsService,private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private categoriasServ: CategoriasService,
              private confirmationService: ConfirmationService,
              private departamentoServ: DepartamentosService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
              }

  ngOnInit(): void {
    this.setMinDate();

    this.departamentoServ.getDatos().then((resp: any) => {
      this.departamento = resp;      
    })

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  filtrarEmpleado(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.empleados.length; i++) {
      const size = this.empleados[i];
      if (size.primernombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.empleadoFiltrados = filtered;
  }

  crearFormulario() {
    this.forma = this.fb.group({
      fech_ini:     ['', Validators.required],
      total_horas:     ['', Validators.required],
      num_emp_supervisor:     ['', Validators.required],
      departamento:     ['', Validators.required],
      motivo:       ['', Validators.required],
      comentario:  ['', Validators.required],
      estado:       ['activo', Validators.required],
      usuario_creador: [this.usuario.username, Validators.required]
    })
  }

  guardarCategoria(){
   
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
