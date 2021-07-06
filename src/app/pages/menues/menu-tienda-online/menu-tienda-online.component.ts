import { Component, OnInit } from '@angular/core';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-tienda-online',
  templateUrl: './menu-tienda-online.component.html',
  styleUrls: ['./menu-tienda-online.component.scss']
})
export class MenuTiendaOnlineComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean;

  constructor(private menuServ: MenuesService) { }
  
  ngOnInit(): void {
    this.getData();
    this.menuServ.formSubmitted.subscribe((resp: any) => {
      this.formSubmitted = resp
    })
  }

  getData() {
    this.formSubmitted = true;
    this.menuServ.getMenu(7).then((resp: any) => {
      this.menu = resp;   
    })
  }

  redirigir(item) {
    
  }

}
