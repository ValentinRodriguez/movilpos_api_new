import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-panel-control',
  templateUrl: './menu-panel-control.component.html',
  styleUrls: ['./menu-panel-control.component.scss']
})
export class MenuPanelControlComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean = true;

  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.menuServ.getMenu(1).then((resp: any) => {
      this.menu = resp;
    });
  }
  
  redirigir(ruta: string) {
    this.router.navigate([`panel-control/${ruta}`]);
  }

}
