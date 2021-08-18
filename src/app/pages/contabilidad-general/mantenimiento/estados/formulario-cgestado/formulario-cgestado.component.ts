import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadosService } from 'src/app/services/contabilidad/estados.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

@Component({
  selector: 'app-formulario-cgestado',
  templateUrl: './formulario-cgestado.component.html',
  styleUrls: ['./formulario-cgestado.component.scss']
})
export class FormularioCgestadoComponent implements OnInit {

  cols: any;
  listsubcriber: any = [];
  index: number = 0;
  forma: FormGroup;
 
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private estadosSrv: EstadosService) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'descripcion_esp', header: 'Descripción Espanol'},
      { field: 'descripcion_ing', header: 'Descripcion Ingles'},
      { field: 'id_estado', header: 'ID Estado'},
      { field: 'grupo', header: 'Grupo'},
      { field: 'orden_grupo', header: 'Orden'},
      { field: 'tipo_estado', header: 'Tipo Estado'},
      { field: 'signo', header: 'Orientacion Signo'}      
    ]
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
      this.estadosSrv.crearEstado(this.forma.value).subscribe((resp: any) => {
              
      })
    }
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
