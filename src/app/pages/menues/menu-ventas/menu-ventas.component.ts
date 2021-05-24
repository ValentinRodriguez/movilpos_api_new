import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-ventas',
  templateUrl: './menu-ventas.component.html',
  styleUrls: ['./menu-ventas.component.scss']
})
export class MenuVentasComponent implements OnInit {

  menu: any[] = [];

  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.menuServ.getMenu(5).then((resp: any) => {
      this.menu = resp;     
    })
  }

  redirigir(ruta: string) {
    console.log(ruta);
    if (ruta === 'interfaz-ventas') {
      this.router.navigate([ruta]);
    }else{
      this.router.navigate([`ventas/${ruta}`]);
    }
  }  
}
