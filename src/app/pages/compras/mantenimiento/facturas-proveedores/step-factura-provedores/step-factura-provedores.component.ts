import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-step-factura-provedores',
  templateUrl: './step-factura-provedores.component.html',
  styleUrls: ['./step-factura-provedores.component.scss']
})
export class StepFacturaProvedoresComponent implements OnInit {

  data: any[] = [];

  constructor(public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    
    let data = this.config.data;
    console.log(data);
    for (const key in data) {
      if (data[key].data.length === 0) {
        this.data.push(data[key])        
      }
    }
    console.log(this.data);    
  }

}
