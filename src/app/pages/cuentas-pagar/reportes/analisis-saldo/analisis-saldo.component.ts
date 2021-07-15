import { Component, OnInit } from '@angular/core';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-analisis-saldo',
  templateUrl: './analisis-saldo.component.html',
  styleUrls: ['./analisis-saldo.component.scss']
})
export class AnalisisSaldoComponent implements OnInit {

  constructor(private globalFunction: GlobalFunctionsService,) { }

  ngOnInit(): void {
  }

}
