import { Component, OnInit } from '@angular/core';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-tienda-online',
  templateUrl: './menu-tienda-online.component.html',
  styleUrls: ['./menu-tienda-online.component.scss']
})
export class MenuTiendaOnlineComponent implements OnInit {

  menu: any[] = [];

  constructor(private menuServ: MenuesService) { }

  ngOnInit(): void {
    this.menuServ.getMenu(7).then((resp: any) => {
      this.menu = resp;
      console.log(this.menu);      
    })
  }

  redirigir(item) {
    
  }

}
