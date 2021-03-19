import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InventarioService } from 'src/app/services/inventario.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss']
})
export class ListaProductosComponent implements OnInit {
  productos: any[] = [];
  selectedProducts = [];
  cols: any[];
  loading: boolean;

  constructor(private inventarioServ: InventarioService,
              private ref: DynamicDialogRef,
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
    this.loading = true;    
    this.inventarioServ.getDatos().then((resp:any)=>{
      this.productos = resp      
      this.loading = false;
    })
  }
  
  enviarProductos() {
    if (this.selectedProducts.length !== 0) {   
      this.inventarioServ.listadoProductosEscogidos(this.selectedProducts);
      this.ref.close();      
    } else {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe escoger al menos un producto');
    }
  }
}
