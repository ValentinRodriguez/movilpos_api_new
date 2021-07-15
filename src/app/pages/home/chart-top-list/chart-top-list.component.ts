import { Component, OnInit } from '@angular/core';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-chart-top-list',
  templateUrl: './chart-top-list.component.html',
  styleUrls: ['./chart-top-list.component.scss']
})
export class ChartTopListComponent implements OnInit {

  constructor(private globalFunction: GlobalFunctionsService,) { }

  ngOnInit(): void {
  }

}
