import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-menu-empresa',
  templateUrl: './menu-empresa.component.html',
  styleUrls: ['./menu-empresa.component.scss']
})
export class MenuEmpresaComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean;

  constructor(private globalFunction: GlobalFunctionsService,private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.menuServ.getMenu(2,'menu-empresa').then((resp: any) => {
      this.menu = resp;   
    })
  }
  
  redirigir(ruta: string) {
    console.log(`mi-negocio/${ruta}`);    
    this.router.navigate([`mi-negocio/${ruta}`]);
  }

}
