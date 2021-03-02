import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-miscelaneos',
  templateUrl: './menu-miscelaneos.component.html',
  styleUrls: ['./menu-miscelaneos.component.scss']
})
export class MenuMiscelaneosComponent implements OnInit {

  menu: any[] = [];

  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.menuServ.getMenu(3).then((resp: any) => {
      this.menu = resp;    
    })
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }

}
