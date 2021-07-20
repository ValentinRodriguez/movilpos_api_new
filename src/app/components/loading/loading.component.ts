import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  formSubmitted = false;
  
  constructor(private globalServ: GlobalFunctionsService,
              private router: Router) { }

  ngOnInit(): void {
    this.globalServ.formSubmitted.subscribe(resp => {
      this.formSubmitted = true;
      // console.log('ENVIADO');      
    });

    this.globalServ.formReceived.subscribe(resp => {
      if (resp.body.urlRequest === this.router.url) {
        this.formSubmitted = false;
        // console.log("urlRequest: "+resp.body.urlRequest);      
      }
    })

  }
}
