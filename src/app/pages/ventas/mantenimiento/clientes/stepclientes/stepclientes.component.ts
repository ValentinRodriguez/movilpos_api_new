import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClientesService } from 'src/app/services/ventas/clientes.service';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';

@Component({
  selector: 'app-stepclientes',
  templateUrl: './stepclientes.component.html',
  styleUrls: ['./stepclientes.component.scss'],
  providers:[ClientesService]
})
export class StepclientesComponent implements OnInit {

  data: any[] = [];
  items: MenuItem[] = [];
  activeIndex = 0;
  
  constructor(public clientesServ: ClientesService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              public datosEstaticosServ: DatosEstaticosService) { }

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
    this.clientesServ.finalizando();
  }

}
