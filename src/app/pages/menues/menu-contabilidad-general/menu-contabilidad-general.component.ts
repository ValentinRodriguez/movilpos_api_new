import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-contabilidad-general',
  templateUrl: './menu-contabilidad-general.component.html',
  styleUrls: ['./menu-contabilidad-general.component.scss']
})
export class MenuContabilidadGeneralComponent implements OnInit {

  menu: any[] = [];

  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.menuServ.getMenu(7).then((resp: any) => {
      this.menu = resp;
      console.log(this.menu);      
    })
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }


}
