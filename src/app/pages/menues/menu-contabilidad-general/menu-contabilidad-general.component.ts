import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-menu-contabilidad-general',
  templateUrl: './menu-contabilidad-general.component.html',
  styleUrls: ['./menu-contabilidad-general.component.scss']
})
export class MenuContabilidadGeneralComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean;
  constructor(private globalFunction: GlobalFunctionsService,private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  
  getData() {
    this.menuServ.getMenu(7).then((resp: any) => {
      this.menu = resp;    
    })
  }

  redirigir(ruta: string) {
    this.router.navigate([`contabilidad-general/${ruta}`]);
  }


}
