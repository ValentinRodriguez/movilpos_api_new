import { Component, OnInit } from '@angular/core';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';

@Component({
  selector: 'app-footer-page',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  year:any;
  constructor(private datosEstaticosServ: DatosEstaticosService) {
    
  }

  ngOnInit(): void {
    this.year = this.datosEstaticosServ.getYear();
  }

}
