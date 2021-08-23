import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-recomendados',
  templateUrl: './recomendados.component.html',
  styleUrls: ['./recomendados.component.scss']
})
export class RecomendadosComponent implements OnInit {

  enlazados = [];
  cols2 = [];

  constructor(private tiendaSrv: TiendaService,
              private router: Router) { }

  ngOnInit(): void {
    const clasificacion = JSON.parse(localStorage.getItem('clasificacion'));
    if (clasificacion[0].id === 4 || clasificacion[0].id === 5) {
      console.log('es ropa');      
    } else {
    console.log('no es ropa');      
    }
    this.cols2 = [
      { field: 'descripcion', header: 'Descripción' },
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'origen', header: 'Origen' },
      { field: 'tipo_cuenta', header: 'Tipo Cuenta' },
      { field: 'catalogo', header: 'Catálogo' },
      { field: 'acciones', header: 'Acciones' },
    ]
  }

  borrarProductoEscogido() {

  }

  buscaProductos() {

  }

  nextPage() {
    this.router.navigate(['plaza-online/creacion-productos-plaza/imagenes-videos']);
    // if (this.atributo.length !== 0) {
    //   this.tiendaServ.createProduct(this.atributo);
    // }else{
    //   this.uimessage.getMiniInfortiveMsg('tst','warn','Atención','Debe escoger una categoría')
    // }
  }

  prevPage() {
    this.router.navigate(['plaza-online/creacion-productos-plaza/atributos']);
  }

}
