import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CoTransaccionescxpService } from 'src/app/services/cuentas-pagar/co-transaccionescxp.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-facturas-pendientes',
  templateUrl: './facturas-pendientes.component.html',
  styleUrls: ['./facturas-pendientes.component.scss']
})
export class FacturasPendientesComponent implements OnInit {

  facturas: any[] = [];
  facturasSeleccionadas = [];
  cols: any[];
  total = 0;
  totalSeleccionado = 0;

  constructor(private facturasServ: CoTransaccionescxpService,
              private ref: DynamicDialogRef,
              private uiMessage: UiMessagesService) { }

  ngOnInit(): void {
    this.todosLasFacturas();
    
    this.cols = [
      { field: 'id', header: '#' },
      { field: 'num_doc', header: 'Factura' },
      { field: 'valor', header: 'Valor' },
      { field: 'monto_itbi', header: 'ITBIS' },
      { field: 'proveedor_nombre', header: 'Proveedor' }
    ] 
  }

  todosLasFacturas() {  
    this.facturasServ.facturasPendientes().then((resp:any)=>{      
      this.facturas = resp   
      
      this.facturas.forEach(element => {    
        this.total += (element.valor + element.monto_itbi);
      });     
    })
  }

  sumaTotal() {
    this.totalSeleccionado = 0;
    this.facturasSeleccionadas.forEach(element => {
      this.totalSeleccionado += (element.valor + element.monto_itbi);
    });     
  }
  
  enviarFacturas() {  
    if (this.facturasSeleccionadas.length !== 0) {   
      this.facturasServ.listadoFacturasEscogidas(this.facturasSeleccionadas);
      this.ref.close();      
    } else {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe escoger al menos un producto');
    }
  }
}
