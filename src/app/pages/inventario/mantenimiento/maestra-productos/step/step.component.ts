import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { InventarioService } from 'src/app/services/inventario.service';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {
  items: MenuItem[] = [];
  activeIndex = 0;
  constructor(public ref: DynamicDialogRef, 
              public inventarioServ: InventarioService,
              public datosEstaticosServ: DatosEstaticosService,
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    let data = this.config.data;
    for (let index = 0; index < data.length; index++) {      
      if (data[index].data.length === 0) {     
        this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(data[index].label)})
        console.log(this.items);          
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
    console.log('cerrar dialogo');  
    this.ref.close();  
    this.inventarioServ.finalizando();
  }
}
