import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-stepclientes',
  templateUrl: './stepclientes.component.html',
  styleUrls: ['./stepclientes.component.scss']
})
export class StepclientesComponent implements OnInit {

  data: any[] = [];

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private route: Router) { }

  ngOnInit(): void {
    let data = this.config.data;
    for (const key in data) {
      if (data[key].data.length === 0) {
        this.data.push(data[key])        
      }
    } 
  }

  crearEmpleado() {
    this.route.navigateByUrl('/gestion-de-empleados');
  }

}
