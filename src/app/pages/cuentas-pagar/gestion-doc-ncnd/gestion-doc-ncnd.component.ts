import { Component, OnInit } from '@angular/core';
import { GestionDocNcdcService } from 'src/app/services/cuentas-pagar/gestion-doc-ncdc.service';

@Component({
  selector: 'app-gestion-doc-ncnd',
  templateUrl: './gestion-doc-ncnd.component.html',
  styleUrls: ['./gestion-doc-ncnd.component.scss']
})
export class GestionDocNcndComponent implements OnInit {

  cols: any;
  documentos: any[] = [];
  
  constructor(private ndncService :GestionDocNcdcService) { }

  ngOnInit(): void {
    this.obtenerDocumentos()
    this.cols = [
      { field: 'num_doc', header: 'Documento' },
      { field: 'tipo_doc', header: 'Tipo Documento' },
      { field: 'fecha_orig', header: 'Fecha' },
    ] 
  }

  obtenerDocumentos() {    
     
    this.ndncService.getDatos().subscribe((resp: any) =>{
      if (resp.code===200){
        this.documentos=resp.data;
      } 
    })
  }

}
