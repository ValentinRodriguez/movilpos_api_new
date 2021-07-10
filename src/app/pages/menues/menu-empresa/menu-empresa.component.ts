import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuesService } from 'src/app/services/menues.service';

@Component({
  selector: 'app-menu-empresa',
  templateUrl: './menu-empresa.component.html',
  styleUrls: ['./menu-empresa.component.scss']
})
export class MenuEmpresaComponent implements OnInit {

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
    this.menuServ.getMenu(2).then((resp: any) => {
      this.menu = resp;   
    })
  }
  
  redirigir(ruta: string) {
    console.log(`mi-negocio/${ruta}`);    
    this.router.navigate([`mi-negocio/${ruta}`]);
  }

}
