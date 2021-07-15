import { Component, OnInit } from '@angular/core';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-online-rnc',
  templateUrl: './online-rnc.component.html',
  styleUrls: ['./online-rnc.component.scss']
})
export class OnlineRncComponent implements OnInit {

  constructor(private globalFunction: GlobalFunctionsService,) { }

  ngOnInit(): void {
  }

}
