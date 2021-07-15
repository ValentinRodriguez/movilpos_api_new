import { Component, OnInit } from '@angular/core';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-step-tipo-mov',
  templateUrl: './step-tipo-mov.component.html',
  styleUrls: ['./step-tipo-mov.component.scss']
})
export class StepTipoMovComponent implements OnInit {

  constructor(private globalFunction: GlobalFunctionsService,) { }

  ngOnInit(): void {
  }

}
