import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-step-ordenes-compras',
  templateUrl: './step-ordenes-compras.component.html',
  styleUrls: ['./step-ordenes-compras.component.scss']
})
export class StepOrdenesComprasComponent implements OnInit {

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
