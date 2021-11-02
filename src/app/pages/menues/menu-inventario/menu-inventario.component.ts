import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/globales/menues.service';

@Component({
  selector: 'app-menu-inventario',
  templateUrl: './menu-inventario.component.html',
  styleUrls: ['./menu-inventario.component.scss']
})
export class MenuInventarioComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean = false;
  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.menuServ.getMenu(4).then((resp: any) => {
      this.menu = resp;   
    })
  }
           
  redirigir(ruta: string) {
    console.log(`inventario/${ruta}`);
    
    this.router.navigate([`inventario/${ruta}`]);  
  }
}
