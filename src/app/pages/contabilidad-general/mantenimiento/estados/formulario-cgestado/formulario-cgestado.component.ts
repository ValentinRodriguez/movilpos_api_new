import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulario-cgestado',
  templateUrl: './formulario-cgestado.component.html',
  styleUrls: ['./formulario-cgestado.component.scss']
})
export class FormularioCgestadoComponent implements OnInit {

  cols: any;
  listsubcriber: any = [];
  index: number = 0;
  constructor() { }

  ngOnInit(): void {
    this.cols = [
      { field: 'descripcion_esp', header: 'Descripción Espanol'},
      { field: 'descripcion_ing', header: 'Descripcion Ingles'},
      { field: 'id_estado', header: 'ID Estado'},
      { field: 'grupo', header: 'Grupo'},
      { field: 'orden_grupo', header: 'Orden'},
      { field: 'tipo_estado', header: 'Tipo Estado'},
      { field: 'signo', header: 'Orientacion Signo'},
      
    ]
  }

}
