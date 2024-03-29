import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/globales/menues.service';

@Component({
  selector: 'app-menu-compras',
  templateUrl: './menu-compras.component.html',
  styleUrls: ['./menu-compras.component.scss'],
  providers:[MenuesService]
})
export class MenuComprasComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean;
  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.menuServ.getMenu(6).then((resp: any) => {
      this.menu = resp;    
    })
  }
  
  redirigir(ruta: string) {
    this.router.navigate([`compras/${ruta}`]);
  }
}
