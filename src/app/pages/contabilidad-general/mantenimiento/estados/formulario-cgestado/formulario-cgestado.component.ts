import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadosService } from 'src/app/services/contabilidad/estados.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-formulario-cgestado',
  templateUrl: './formulario-cgestado.component.html',
  styleUrls: ['./formulario-cgestado.component.scss'],
  providers:[EstadosService]
})
export class FormularioCgestadoComponent implements OnInit {

  cols: any;
  listsubcriber: any = [];
  index: number = 0;
  forma: FormGroup;
  guardar = true;
  actualizar = false;
  vtipoEstado: any = [];
  signo: any = [];
  usuario: any = [];
  id: number;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private estadosSrv: EstadosService) {    
      this.crearFormulario();
  }

  ngOnInit(): void {
    this.estadosSrv.actualizar.subscribe((id: any) => {
      this.guardar = false;
      this.actualizar = true;
      this.id = id;
      this.estadosSrv.getDato(id).then((resp: any) => {
        this.forma.patchValue(resp);
        this.forma.get('tipo_estado').setValue(this.vtipoEstado.find(estado => resp.tipo_estado === estado.values));
        this.forma.get('signo').setValue(this.signo.find(estado => resp.signo === estado.values))
      })      
    });

    this.vtipoEstado = [
      {label: 'ACTIVOS',values: 'ACTIVOS'},
      {label: 'PASIVOS Y CAPITAL',values: 'PASIVOS_Y_CAPITAL'},
      {label: 'CAPITAL',values: 'CAPITAL'}
    ]

    this.signo = [
      {label: '1',values: 1},
      {label: '-1',values: -1}
    ]
    
    this.cols = [
      { field: 'descripcion_esp', header: 'Descripción Espanol'},
      { field: 'descripcion_ing', header: 'Descripcion Ingles'},
      { field: 'id_estado', header: 'ID Estado'},
      { field: 'grupo', header: 'Grupo'},
      { field: 'orden_grupo', header: 'Orden'},
      { field: 'tipo_estado', header: 'Tipo Estado'},
      { field: 'signo', header: 'Orientacion Signo'}      
    ]
    console.log(this.vtipoEstado);
  }

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion_esp: ['',Validators.required],
      descripcion_ing: ['',Validators.required],
      id_estado: ['',Validators.required],
      grupo: ['',Validators.required],
      orden_grupo: [''],
      tipo_estado: [''],
      signo: [''],
      estado: ['activo'],
      
    })
  }

  guardarEstado() {    
    if (this.forma.invalid) {
      console.log(this.forma.value);      
      this.uiMessage.getMiniInfortiveMsg('tst', 'error', 'ERROR', 'Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control => {
        control.markAllAsTouched();
      })
    } else {
      this.estadosSrv.crearEstado(this.forma.value).then((resp: any) => {
        console.log(resp);              
        if (resp.code === 200) {
          this.estadosSrv.llamarEstado.emit(true);
          this.uiMessage.getMiniInfortiveMsg('tst', 'success', 'Excelente', 'Registro Guardado de manera correcta.');
        }
      })
    }
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

  ActualizarEstado() {
    if (this.forma.invalid) {
      console.log(this.forma.value);      
      this.uiMessage.getMiniInfortiveMsg('tst', 'error', 'ERROR', 'Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control => {
        control.markAllAsTouched();
      })
    } else {
      this.estadosSrv.actualizarEstado(this.id,this.forma.value).then((resp: any) => {
        this.estadosSrv.llamarEstado.emit(true);
        this.uiMessage.getMiniInfortiveMsg('tst', 'success', 'Excelente', 'Registro Guardado de manera correcta.');
      })
    }
  }
  
  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.estadosSrv.guardando();  
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }
}
