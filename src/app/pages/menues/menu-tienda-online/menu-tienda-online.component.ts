import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/globales/menues.service';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-menu-tienda-online',
  templateUrl: './menu-tienda-online.component.html',
  styleUrls: ['./menu-tienda-online.component.scss']
})
export class MenuTiendaOnlineComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean;

  constructor(private menuServ: MenuesService,
              private router: Router) { }
  
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.menuServ.getMenu(11).then((resp: any) => {
      this.menu = resp;   
    })
  }

  redirigir(ruta: string) {
    this.router.navigate([`plaza-online/${ruta}`]);
  }

}
