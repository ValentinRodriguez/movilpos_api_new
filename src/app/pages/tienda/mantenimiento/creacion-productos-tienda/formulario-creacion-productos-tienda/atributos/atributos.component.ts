import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-atributos',
  templateUrl: './atributos.component.html',
  styleUrls: ['./atributos.component.scss']
})
export class AtributosComponent implements OnInit {
  atributo: any;
  tiendaServ: any;
  uimessage: any;

  constructor(private tiendaSrv: TiendaService,
              private router: Router) { }

  ngOnInit(): void {
    const clasificacion = JSON.parse(localStorage.getItem('clasificacion'));

    if (clasificacion[0].id === 4 || clasificacion[0].id === 5) {
      console.log('es ropa');      
    } else {
      console.log('no es ropa');      
    }
  }

  nextPage() {
    this.router.navigate(['plaza-online/creacion-productos-plaza/productos-enlazados']);
    // if (this.atributo.length !== 0) {
    //   this.tiendaServ.createProduct(this.atributo);
    // }else{
    //   this.uimessage.getMiniInfortiveMsg('tst','warn','Atención','Debe escoger una categoría')
    // }
  }

  prevPage() {
      this.router.navigate(['plaza-online/creacion-productos-plaza/atributo']);
  }

}
