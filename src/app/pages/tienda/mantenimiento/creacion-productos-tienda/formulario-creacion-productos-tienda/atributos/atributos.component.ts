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
  uimessage: any;

  constructor(private tiendaSrv: TiendaService,
              private router: Router) { }

  ngOnInit(): void {
    const clasificacion = JSON.parse(localStorage.getItem('clasificacion'));
    console.log(clasificacion);

    switch (clasificacion.length) {
      case 1:
        this.tiendaSrv.getDataCategoria(clasificacion[0].id, 'categoria-plaza').then((resp: any) => {
          console.log(resp);          
        })
        break;
      
      case 2:
        this.tiendaSrv.getDataCategoria(clasificacion[0].id, 'subcategoria-plaza').then((resp: any) => {
          console.log(resp);          
        })
        break;
      
      case 3:
        this.tiendaSrv.getDataCategoria(clasificacion[0].id, 'subsubcategoria-plaza').then((resp: any) => {
          console.log(resp);          
        })
        break;
      
      default:
        break;
    }
  }

  nextPage() {
    this.router.navigate(['plaza-online/creacion-productos-plaza/productos-enlazados']);
    if (this.atributo.length !== 0) {
      this.tiendaSrv.createProduct(this.atributo);
    }else{
      this.uimessage.getMiniInfortiveMsg('tst','warn','Atención','Debe escoger una categoría')
    }
  }

  prevPage() {
      this.router.navigate(['plaza-online/creacion-productos-plaza/clasificacion']);
  }

}
