import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-inventario',
  templateUrl: './menu-inventario.component.html',
  styleUrls: ['./menu-inventario.component.scss']
})
export class MenuInventarioComponent implements OnInit {

  menu: any[] = [];

  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.menuServ.getMenu(4).then((resp: any) => {
      this.menu = resp;    
    })
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }

}
