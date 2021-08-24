import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/globales/menues.service';

@Component({
  selector: 'app-menu-ventas',
  templateUrl: './menu-ventas.component.html',
  styleUrls: ['./menu-ventas.component.scss'],
  providers:[MenuesService]
})
export class MenuVentasComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean;

  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.menuServ.getMenu(5).then((resp: any) => {
      this.menu = resp;   
    })
  }

  redirigir(ruta: string) {
    this.router.navigate([`ventas/${ruta}`]);
  }  
}
