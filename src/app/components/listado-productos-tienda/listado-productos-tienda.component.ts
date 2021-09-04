import { Component, OnInit } from '@angular/core';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
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
   

  constructor(private tiendaSrv: TiendaService,
              private uiMessage: UiMessagesService) { }

  ngOnInit(): void {
    this.todosLosProductos();

    this.cols = [
      { field: 'id', header: '#' },
      { field: 'imagen', header: 'Producto' },
      { field: 'codigo', header: 'Código' },
      { field: 'precio_venta', header: 'Precio' },
      { field: 'cantidad1', header: 'Cantidad' }
    ] 
  }

  todosLosProductos() {    
    this.tiendaSrv.getDatosProducto('productos-plaza').then((resp:any)=>{
      this.productos = resp;
      console.log(resp);      
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
