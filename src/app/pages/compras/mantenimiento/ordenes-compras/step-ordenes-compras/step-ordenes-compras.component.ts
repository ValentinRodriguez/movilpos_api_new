import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { OrdenescomprasService } from 'src/app/services/ordenescompras.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-step-ordenes-compras',
  templateUrl: './step-ordenes-compras.component.html',
  styleUrls: ['./step-ordenes-compras.component.scss']
})
export class StepOrdenesComprasComponent implements OnInit {

  items: MenuItem[] = [];
  activeIndex = 0;

  constructor(private globalFunction: GlobalFunctionsService,public config: DynamicDialogConfig,
              public ref: DynamicDialogRef,
              public datosEstaticosServ: DatosEstaticosService,
              public ordCompras: OrdenescomprasService ) { }

  ngOnInit(): void {
    let data = this.config.data;
    for (let index = 0; index < data.length; index++) {      
      if (data[index].data.length === 0) {     
        this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(data[index].label)})   
      }      
    } 
  }

  cambiaIndex(index) {
    this.activeIndex = index;    
  }

  prevPage() {
    this.cambiaIndex(this.activeIndex - 1)
  }

  nextPage() {
    this.cambiaIndex(this.activeIndex + 1)
  }

  finalizar() {
      
    this.ref.close();  
    this.ordCompras.finalizando();
  }
}
