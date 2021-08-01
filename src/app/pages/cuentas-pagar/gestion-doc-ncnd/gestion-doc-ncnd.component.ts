import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-doc-ncnd',
  templateUrl: './gestion-doc-ncnd.component.html',
  styleUrls: ['./gestion-doc-ncnd.component.scss']
})
export class GestionDocNcndComponent implements OnInit {

  cols: any;
  documentos: any[] = [];
  
  constructor() { }

  ngOnInit(): void {
    this.cols = [
      { field: 'nom_sp', header: 'Proveedor' },
      { field: 'documento', header: 'Documento' },
      { field: 'tel_sp', header: 'Teléfono' },
      { field: 'email', header: 'Email' },
      { field: 'ciudad', header: 'Ciudad' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

}
