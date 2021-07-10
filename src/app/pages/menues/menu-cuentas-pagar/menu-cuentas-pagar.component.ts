import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-cuentas-pagar',
  templateUrl: './menu-cuentas-pagar.component.html',
  styleUrls: ['./menu-cuentas-pagar.component.scss']
})
export class MenuCuentasPagarComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean;

  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.menuServ.formSubmitted.subscribe((resp: any) => {
      this.formSubmitted = resp;
    });
    
    this.getData();
  }

  getData() {
    this.formSubmitted = true;
    this.menuServ.getMenu(10).then((resp: any) => {
      this.menu = resp;   
    })
  }

  redirigir(ruta: string) {
    this.router.navigate([`cuentas-pagar/${ruta}`]);
  }

}
