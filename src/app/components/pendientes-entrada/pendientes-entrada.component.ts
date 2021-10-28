import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { TransaccionesService } from 'src/app/services/inventario/transacciones.service';

@Component({
  selector: 'app-pendientes-entrada',
  templateUrl: './pendientes-entrada.component.html',
  styleUrls: ['./pendientes-entrada.component.scss']
})
export class PendientesEntradaComponent implements OnInit {
  pendientes: any;
  cols: { field: string; header: string; }[];
  selectedProducts = [];
  usuario: any;
  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private transPendientes: TransaccionesService,
              private uiMessage: UiMessagesService) {
                
               }

  ngOnInit(): void {
    this.pendientes = this.config.data.lista;
    this.cols = [
      { field: 'id', header: 'Recibido' },
      //{ field: 'transportista_nombre', header: 'Transportista' },
      { field: 'origen', header: 'Tipo' },
      { field: 'id_bodega', header: 'Bodega O.' },
      { field: 'id_bodega_d', header: 'Bodega D.' },
      { field: 'num_doc', header: 'Documento' },
      { field: 'fecha', header: 'Fecha' },
      //{ field: 'descripcion_cuenta', header: 'Descripción' },
      { field: 'usuario', header: 'Usuario' },
      //{ field: 'cantidad1', header: 'Cantidad' },
      { field: 'check_impresión', header: 'Impresión' },
      { field: 'check_detalle', header: 'Detalle' }
    ] 
  }

  enviarProductos() {
    this.selectedProducts.forEach(element => {
      element.usuario_modificador = this.usuario.username;
      element.firma_recibido_por = this.usuario.username;      
      this.transPendientes.recibirTransaccion(element).then((resp: any) =>{
        this.uiMessage.getMiniInfortiveMsg('tst','errsuccessor','AtExcelenteención','Producto ingresado a almacen');
        this.transPendientes.transaccionesPendientes(this.usuario.email).then((resp: any) => {
          this.pendientes = resp;
        })
      })
    });
  }
}
