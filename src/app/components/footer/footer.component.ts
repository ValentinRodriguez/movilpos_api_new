import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-footer-page',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  year: any;
  @Input() simbolo: string;
  
  constructor(private globalFunction: GlobalFunctionsService,private datosEstaticosServ: DatosEstaticosService) { }
  
  ngOnInit(): void {
    this.year = this.datosEstaticosServ.getYear();
  }

}
