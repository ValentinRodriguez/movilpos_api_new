import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from 'src/app/app.main.component';
import {SelectItem} from 'primeng/api';

AppMainComponent
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-right-menu-page',
  templateUrl: './right-menu-page.component.html',
  styleUrls: ['./right-menu-page.component.scss']
})
export class RightMenuPageComponent implements OnInit {

  amount: SelectItem[];

  selectedAmount: any;

  constructor(public app: AppMainComponent) {
      this.amount = [
          {label: '*****24', value: {id: 1, name: '*****24', code: 'A1'}},
          {label: '*****75', value: {id: 2, name: '*****75', code: 'A2'}}
      ];
  }

  ngOnInit(): void {
  }

  

}
