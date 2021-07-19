import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TransaccionesService } from 'src/app/services/transacciones.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
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
  constructor(private globalFunction: GlobalFunctionsService,public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private transPendientes: TransaccionesService,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,) {
                this.usuario = this.usuariosServ.getUserLogged()
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
      { field: 'usuario_creador', header: 'Usuario' },
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
