import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/globales/menues.service';

@Component({
  selector: 'app-menu-cuentas-pagar',
  templateUrl: './menu-cuentas-pagar.component.html',
  styleUrls: ['./menu-cuentas-pagar.component.scss'],
  providers:[MenuesService]
})
export class MenuCuentasPagarComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean;

  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    
    this.getData();
  }

  getData() {
    this.menuServ.getMenu(10).then((resp: any) => {
      this.menu = resp;   
    })
  }

  redirigir(ruta: string) {
    this.router.navigate([`cuentas-pagar/${ruta}`]);
  }

}
