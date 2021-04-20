import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-step-home',
  templateUrl: './step-home.component.html',
  styleUrls: ['./step-home.component.scss']
})
export class StepHomeComponent implements OnInit {

  data: any[] = [];
  items: MenuItem[] = [];
  activeIndex = 0;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private homeServ: HomeService,
              public datosEstaticosServ: DatosEstaticosService) { }

  ngOnInit(): void {
    let data = this.config.data;
    console.log(data);
    
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
    this.homeServ.finalizando();
  }

}
