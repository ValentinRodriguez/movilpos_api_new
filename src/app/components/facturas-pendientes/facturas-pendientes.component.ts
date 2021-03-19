import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CoTransaccionescxpService } from 'src/app/services/co-transaccionescxp.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

@Component({
  selector: 'app-facturas-pendientes',
  templateUrl: './facturas-pendientes.component.html',
  styleUrls: ['./facturas-pendientes.component.scss']
})
export class FacturasPendientesComponent implements OnInit {

  facturas: any[] = [];
  facturasSeleccionadas = [];
  cols: any[];
  loading: boolean;

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
    this.loading = true;    
    this.facturasServ.facturasPendientes().then((resp:any)=>{      
      this.facturas = resp      
      this.loading = false;
    })
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
