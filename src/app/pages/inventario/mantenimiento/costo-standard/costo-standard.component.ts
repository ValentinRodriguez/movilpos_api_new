import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-costo-standard',
  templateUrl: './costo-standard.component.html',
  styleUrls: ['./costo-standard.component.scss']
})
export class CostoStandardComponent implements OnInit, OnDestroy {

  cols: any;
  costos: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'descripcion' },
      { field: 'sucursal', header: 'sucursal' },
      { field: 'empresa', header: 'empresa' },
      { field: 'departamento', header: 'departamento' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  ngOnDestroy(): void {
      
  }


}
