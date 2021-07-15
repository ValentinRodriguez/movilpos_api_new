import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/domain/product';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-chart-table',
  templateUrl: './chart-table.component.html',
  styleUrls: ['./chart-table.component.scss']
})
export class ChartTableComponent implements OnInit {

  orderWeek: any;
  selectedOrderWeek: any;
  products: Product[];
  productsLastWeek: Product[];
  productsThisWeek: Product[];

  constructor(private globalFunction: GlobalFunctionsService,) { }

  ngOnInit(): void {
    this.orderWeek = [
      {name: 'This Week', code: '0'},
      {name: 'Last Week', code: '1'}
    ];
  }
  
  recentSales(event) {
    if (event.value.code === '0') {
        this.products = this.productsThisWeek;
    } else {
        this.products = this.productsLastWeek;
    }
  }
  
}
