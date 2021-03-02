import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-step-empleados',
  templateUrl: './step-empleados.component.html',
  styleUrls: ['./step-empleados.component.scss']
})
export class StepEmpleadosComponent implements OnInit {

  data: any[] = [];

  constructor(public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    let data = this.config.data;
    for (const key in data) {
      if (data[key].data.length === 0) {
        this.data.push(data[key])        
      }
    }
    console.log(this.data);    
  }

}
