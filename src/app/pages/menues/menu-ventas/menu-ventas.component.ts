import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-menu-ventas',
  templateUrl: './menu-ventas.component.html',
  styleUrls: ['./menu-ventas.component.scss']
})
export class MenuVentasComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean;

  constructor(private globalFunction: GlobalFunctionsService,private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.menuServ.getMenu(5).then((resp: any) => {
      this.menu = resp;   
    })
  }

  redirigir(ruta: string) {
    console.log(ruta);
    this.router.navigate([`ventas/${ruta}`]);
  }  
}
