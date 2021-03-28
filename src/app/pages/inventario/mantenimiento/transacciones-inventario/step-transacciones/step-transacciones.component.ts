import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-step-transacciones',
  templateUrl: './step-transacciones.component.html',
  styleUrls: ['./step-transacciones.component.scss']
})
export class StepTransaccionesComponent implements OnInit {

  data: any[] = [];

  constructor(public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    let data = this.config.data;
    for (const key in data) {
      if (data[key].data.length === 0) {
        this.data.push(data[key])        
      }
    }
  }

}
