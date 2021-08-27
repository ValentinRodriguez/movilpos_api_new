import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  formSubmitted = true;
  @Input() url:string = ''
  constructor(private globalServ: GlobalFunctionsService) { }

  ngOnInit(): void {
    const ruta = this.url.split('/')
    console.log(ruta);
    if (ruta[1] === 'home' || ruta[1] === 'menues') {
      this.formSubmitted = false;
    } else {
      this.globalServ.formSubmitted.subscribe(resp => {
        this.formSubmitted = resp;      
      });
  
      this.globalServ.formReceived.subscribe(resp => {
        this.formSubmitted = resp;
      })      
    }
  }
}
