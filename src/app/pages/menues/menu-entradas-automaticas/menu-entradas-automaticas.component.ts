import { Component, OnInit } from '@angular/core';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-entradas-automaticas',
  templateUrl: './menu-entradas-automaticas.component.html',
  styleUrls: ['./menu-entradas-automaticas.component.scss']
})
export class MenuEntradasAutomaticasComponent implements OnInit {
  menu: any[] = [];
  formSubmitted: boolean;

  constructor(private menuServ: MenuesService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.menuServ.getMenu(8).then((resp: any) => {
      this.menu = resp;   
    })
  }

  redirigir(item) {
    
  }

}
