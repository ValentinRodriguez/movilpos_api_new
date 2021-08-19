import { Component, OnInit } from '@angular/core';
import { EstadosService } from 'src/app/services/contabilidad/estados.service';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent implements OnInit {

  cols: any;
  listsubcriber: any = [];
  index: number = 0;
  estados: any[] = [];
  
  constructor(private estadosServ: EstadosService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'descripcion_esp', header: 'Descripción Espanol'},
      { field: 'descripcion_ing', header: 'Descripcion Ingles'},
      { field: 'id_estado', header: 'ID Estado'},
      { field: 'grupo', header: 'Grupo'},
      { field: 'orden_grupo', header: 'Orden'},
      { field: 'tipo_estado', header: 'Tipo Estado'},
      { field: 'signo', header: 'Signo' },
      { field: 'acciones', header: 'Acciones'}  
    ]

    this.getEstados();
  }

  getEstados() {
    this.estadosServ.getDatos().subscribe((resp: any) => {
      if (resp.code === 200) {
        this.estados = resp.data
      }     
    })
  }
}
