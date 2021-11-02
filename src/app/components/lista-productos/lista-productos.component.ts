import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss']
})
export class ListaProductosComponent implements OnInit {
  productos: any[] = [];
  selectedProducts = [];
  cols: any[];
   

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
    this.inventarioServ.getDatos().subscribe((resp:any)=>{
      if (resp.ok) {
        this.productos = resp.data           
      }
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
