import { Component, OnInit } from '@angular/core';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  formSubmitted = true;
  
  constructor(private globalServ: GlobalFunctionsService) { }

  ngOnInit(): void {
    this.globalServ.formSubmitted.subscribe(resp => {
      console.log('FORMULARIO ENVIADO');      
      this.formSubmitted = resp;      
    });

    this.globalServ.formReceived.subscribe(resp => {
      console.log('FORMULARIO RECIBIDO'); 
      this.formSubmitted = resp;
    })

  }
}
