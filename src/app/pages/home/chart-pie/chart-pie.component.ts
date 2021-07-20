import { Component, OnInit } from '@angular/core';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-chart-pie',
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.scss']
})
export class ChartPieComponent implements OnInit {

  revenueChart: any;
  constructor() { }

  ngOnInit(): void {
    this.revenueChart = {
      labels: ['Direct', 'Promoted', 'Affiliate'],
      datasets: [{
          data: [40, 35, 25],
          backgroundColor: ['#64B5F6', '#7986CB', '#4DB6AC']
      }]
  };
  }

}
