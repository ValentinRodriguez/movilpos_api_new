import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-menu-cuentas-pagar',
  templateUrl: './menu-cuentas-pagar.component.html',
  styleUrls: ['./menu-cuentas-pagar.component.scss']
})
export class MenuCuentasPagarComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean;

  constructor(private globalFunction: GlobalFunctionsService,private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    
    this.getData();
  }

  getData() {
    this.menuServ.getMenu(10,'menu-cuentas-pagar').then((resp: any) => {
      this.menu = resp;   
    })
  }

  redirigir(ruta: string) {
    this.router.navigate([`cuentas-pagar/${ruta}`]);
  }

}
