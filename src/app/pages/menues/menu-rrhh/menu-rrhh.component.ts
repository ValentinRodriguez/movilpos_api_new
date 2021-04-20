import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-rrhh',
  templateUrl: './menu-rrhh.component.html',
  styleUrls: ['./menu-rrhh.component.scss']
})
export class MenuRrhhComponent implements OnInit {

  menu: any[] = [];

  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.menuServ.getMenu(9).then((resp: any) => {
      this.menu = resp;
       ;      
    })
  }

  redirigir(ruta: string) {
    this.router.navigate([`rrhh/${ruta}`]);
  }


}
