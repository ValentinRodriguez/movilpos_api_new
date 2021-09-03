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

  constructor(private tiendaServ: TiendaService,
              private router: Router) { }

  ngOnInit(): void {
    this.tiendaServ.returnToGeneral()
    this.buscarProductos();

    this.cols2 = [
      { field: 'descripcion', header: 'Descripción' },
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'origen', header: 'Origen' },
      { field: 'tipo_cuenta', header: 'Tipo Cuenta' },
      { field: 'catalogo', header: 'Catálogo' },
      { field: 'acciones', header: 'Acciones' },
    ]
  }

  buscarProductos() {
    this.tiendaServ.getDatosProducto('productos-plaza').then((resp: any) => {
      this.enlazados = resp;
      console.log(resp);      
    })
  }

  borrarProductoEscogido() {

  }

  buscaProductos() {

  }

  nextPage() {
    if (this.enlazados.length === 0) {
      this.tiendaServ.createProduct(null, 'enlazados');      
    }else{
      this.tiendaServ.createProduct(this.enlazados, 'enlazados');      
    }
    this.router.navigate(['plaza-online/creacion-productos-plaza/crear-producto']);
  }

  prevPage() {
    this.router.navigate(['plaza-online/creacion-productos-plaza/atributos']);
  }

}
