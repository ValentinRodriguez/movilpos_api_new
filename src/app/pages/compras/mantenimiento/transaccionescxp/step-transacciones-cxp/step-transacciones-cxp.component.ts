import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-step-transacciones-cxp',
  templateUrl: './step-transacciones-cxp.component.html',
  styleUrls: ['./step-transacciones-cxp.component.scss']
})
export class StepTransaccionesCxpComponent implements OnInit {
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
