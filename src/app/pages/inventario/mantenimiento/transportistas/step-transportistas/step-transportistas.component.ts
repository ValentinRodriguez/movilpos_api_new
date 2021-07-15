import { Component, OnInit } from '@angular/core';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-step-transportistas',
  templateUrl: './step-transportistas.component.html',
  styleUrls: ['./step-transportistas.component.scss']
})
export class StepTransportistasComponent implements OnInit {

  constructor(private globalFunction: GlobalFunctionsService,) { }

  ngOnInit(): void {
  }

}
