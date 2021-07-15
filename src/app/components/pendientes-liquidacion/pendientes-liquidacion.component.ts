import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LiquidacionMercanciasService } from 'src/app/services/liquidacion-mercancias.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-pendientes-liquidacion',
  templateUrl: './pendientes-liquidacion.component.html',
  styleUrls: ['./pendientes-liquidacion.component.scss']
})
export class PendientesLiquidacionComponent implements OnInit { 

  pendientes: any[] = [];
  pendientesSeleccionados = [];
  productos: any[] = [];
  cols: any[];   

  constructor(private globalFunction: GlobalFunctionsService,public pendientesLiquidacion: LiquidacionMercanciasService,
              private ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private uiMessage: UiMessagesService) { }

  ngOnInit(): void {
    this.pendientes = this.config.data;
    
    this.cols = [
      { field: 'id', header: '#' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'tipo_doc', header: 'Tipo' },
      { field: 'id_num_oc', header: 'Orden' },
      { field: 'num_doc', header: 'Rep. Entrada' },
      { field: 'proveedores_nom_sp', header: 'Proveedor' }
    ]
  }
  
 
  enviarPendiente() {
    if (this.pendientesSeleccionados.length !== 0) {   
      this.pendientesLiquidacion.pendienteEscogidas(this.pendientesSeleccionados);
      this.ref.close();      
    } else {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe escoger al menos una cuenta');
    }
  }
}
