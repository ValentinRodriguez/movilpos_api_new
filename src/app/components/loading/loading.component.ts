import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  @Input() formSubmitted: boolean;

  constructor(private globalServ: GlobalFunctionsService,
              private router: Router) { }

  ngOnInit(): void {
    this.globalServ.formSubmitted.subscribe(resp => {
      // console.log(this.router.url);      
      // console.log(resp);      
    })
  }

}
