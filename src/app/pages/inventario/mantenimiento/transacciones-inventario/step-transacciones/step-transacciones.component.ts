import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { TransaccionesService } from 'src/app/services/inventario/transacciones.service';

@Component({
  selector: 'app-step-transacciones',
  templateUrl: './step-transacciones.component.html',
  styleUrls: ['./step-transacciones.component.scss'],
  providers:[TransaccionesService]
})
export class StepTransaccionesComponent implements OnInit {

  items: MenuItem[] = [];
  activeIndex = 0;

  constructor(public config: DynamicDialogConfig,
              public ref: DynamicDialogRef, 
              public transaccionesServ: TransaccionesService,
              public datosEstaticosServ: DatosEstaticosService,) { }

  ngOnInit(): void {
    let data = this.config.data;
    ;
    
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
    this.transaccionesServ.finalizando();
  }

}
