import { Component, OnInit } from '@angular/core';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-chart-task',
  templateUrl: './chart-task.component.html',
  styleUrls: ['./chart-task.component.scss']
})
export class ChartTaskComponent implements OnInit {

  constructor(private globalFunction: GlobalFunctionsService,) { }

  ngOnInit(): void {
  }

}
