import { Component, OnInit } from '@angular/core';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-step-ordenes-pedidos',
  templateUrl: './step-ordenes-pedidos.component.html',
  styleUrls: ['./step-ordenes-pedidos.component.scss']
})
export class StepOrdenesPedidosComponent implements OnInit {

  constructor(private globalFunction: GlobalFunctionsService,) { }

  ngOnInit(): void {
  }

}
