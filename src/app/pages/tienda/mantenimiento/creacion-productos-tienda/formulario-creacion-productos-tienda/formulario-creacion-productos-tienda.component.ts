import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-formulario-creacion-productos-tienda',
  templateUrl: './formulario-creacion-productos-tienda.component.html',
  styleUrls: ['./formulario-creacion-productos-tienda.component.scss']
})
export class FormularioCreacionProductosTiendaComponent implements OnInit {

  items: MenuItem[] = [];
  
  constructor() { }

  ngOnInit(): void {
    this.items = [
      {label: 'General',routerLink: 'general'},
      {label: 'Clasificación',routerLink: 'clasificacion'},
      {label: 'Atributos',routerLink: 'atributos'},
      {label: 'Productos Enlazados',routerLink: 'productos-enlazados'},
      {label: 'Imagenes y Videos',routerLink: 'imagenes-videos'},
      {label: 'Datos Envío',routerLink: 'envios'},
      {label: 'Crear Producto',routerLink: 'crear-producto'},
    ];
  }
  
  
  
  
  
  
}
