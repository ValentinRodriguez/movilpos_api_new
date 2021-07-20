import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
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
  }

}
