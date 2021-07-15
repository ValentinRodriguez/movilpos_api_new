import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InventarioService } from 'src/app/services/inventario.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss']
})
export class ListaProductosComponent implements OnInit {
  productos: any[] = [];
  selectedProducts = [];
  cols: any[];
   

  constructor(private globalFunction: GlobalFunctionsService,private inventarioServ: InventarioService,
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
    this.inventarioServ.getDatos().then((resp:any)=>{
      this.productos = resp   
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
