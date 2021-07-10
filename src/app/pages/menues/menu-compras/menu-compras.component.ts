import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-compras',
  templateUrl: './menu-compras.component.html',
  styleUrls: ['./menu-compras.component.scss']
})
export class MenuComprasComponent implements OnInit {

  menu: any[] = [];
  formSubmitted: boolean;
  constructor(private menuServ: MenuesService,
              private router: Router) { }

  ngOnInit(): void {
    this.getData();
    this.menuServ.formSubmitted.subscribe((resp: any) => {
      this.formSubmitted = resp
    })
  }

  getData() {
    this.formSubmitted = true;
    this.menuServ.getMenu(6).then((resp: any) => {
      this.menu = resp;    
    })
  }
  
  redirigir(ruta: string) {
    this.router.navigate([`compras/${ruta}`]);
  }
}
