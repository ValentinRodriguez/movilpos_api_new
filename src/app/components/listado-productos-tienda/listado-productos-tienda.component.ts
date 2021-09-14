import { Component, OnInit } from '@angular/core';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-listado-productos-tienda',
  templateUrl: './listado-productos-tienda.component.html',
  styleUrls: ['./listado-productos-tienda.component.scss']
})
export class ListadoProductosTiendaComponent implements OnInit {

  productos: any[] = [];
  selectedProducts = [];
  cols: any[];
  loading: boolean;

  constructor(private tiendaSrv: TiendaService) { }

  ngOnInit(): void {
    this.todosLosProductos();

    this.cols = [
      { field: 'imagen', header: 'Producto' },
      { field: 'codigo', header: 'Código' },
      { field: 'precio', header: 'Precio' },
      { field: 'stock', header: 'Cantidad' }
    ] 
  }
  onRowSelect(){
    this.tiendaSrv.listadoProductosEscogidos(this.selectedProducts);   
  }

  onRowUnselect(){
    this.tiendaSrv.listadoProductosEscogidos(this.selectedProducts);   
  }

  todosLosProductos() {
    this.loading = true;    
    this.tiendaSrv.getDatosProducto('productos-plaza').then((resp:any)=>{
      this.productos = resp;
      this.loading = false;
    })
  }
  
  enviarProductos() {
    // if (this.selectedProducts.length !== 0) {   
    //   this.inventarioServ.listadoProductosEscogidos(this.selectedProducts);     
    // } else {
    //   this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe escoger al menos un producto');
    // }
  }
}
