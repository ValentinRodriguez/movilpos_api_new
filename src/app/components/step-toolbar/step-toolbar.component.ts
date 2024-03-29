import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';

@Component({
  selector: 'app-step-toolbar',
  templateUrl: './step-toolbar.component.html',
  styleUrls: ['./step-toolbar.component.scss']
})
export class StepToolbarComponent implements OnInit {

  @Input() items: any[] = [];
  index = 0;
  inicio: any;

  constructor(public router: Router,
              private globalServ: GlobalFunctionsService) { }

  ngOnInit(): void { 
    this.inicio = this.router.url.split("/");       
    this.navegacion(this.index);
  }
  
  nextPage(pagina) {
    this.index += pagina;   
    this.navegacion(this.index)
  }
  
  prevPage(pagina) {
    this.index -= pagina;   
    this.navegacion(this.index)
  }

  finalizar() {        
    this.globalServ.finalizando();
  }

  navegacion(pagina) {    
    if (this.items.length !== 0) {
      if (this.inicio[1] === 'dashboard') {
        this.router.navigate([`/${this.inicio[1]}/dashboard/${this.items[pagina].routerLink}`]);        
        console.log(`/${this.inicio[1]}/${this.items[pagina].routerLink}`);
      } else {
        this.router.navigate([`/${this.inicio[1]}/${this.inicio[2]}/${this.items[pagina].routerLink}`]);
        console.log(`/${this.inicio[1]}/${this.inicio[2]}/${this.items[pagina].routerLink}`);        
      }
    }
  }
}
