import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CoTransaccionescxpService } from 'src/app/services/cuentas-pagar/co-transaccionescxp.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-facturas-proveedores',
  templateUrl: './facturas-proveedores.component.html',
  styleUrls: ['./facturas-proveedores.component.scss']
})
export class FacturasProveedoresComponent implements OnInit {

  usuario: any;
  index: number = 0;
  facturas: any[] = [];
  id_categoria: any;
  cols: any[];
    
  listSubscribers: any = [];

  constructor(
              private coTransaccionesServ: CoTransaccionescxpService,
              private confirmationService: ConfirmationService,
              private uiMessage: UiMessagesService,
              public dialogService: DialogService) { 
                ;                
              }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todasLasFacturas();
    this.listObserver();

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'num_doc', header: 'Factura' },
      { field: 'proveedor_nombre', header: 'Proveedor'},
      { field: 'fecha_orig', header: 'Fecha Factura'},
      { field: 'fecha_proc', header: 'Fecha Vencimiento'},
      { field: 'moneda', header: 'Moneda'},
      { field: 'valor', header: 'Valor'},
      { field: 'monto_itbi', header: 'ITBIS'},
      { field: 'bienes', header: 'Bienes'},
      { field: 'servicios', header: 'Servicios'},
      { field: 'retencion', header: 'Retención'},
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  listObserver = () => {
    const observer1$ = this.coTransaccionesServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    const observer2$ = this.coTransaccionesServ.facturaGuardada.subscribe(()=>{
      this.todasLasFacturas();
    })

    const observer3$ = this.coTransaccionesServ.facturaBorrada.subscribe(()=>{      
      this.todasLasFacturas();   
    })

    const observer4$ = this.coTransaccionesServ.facturaAct.subscribe(() => {
      this.todasLasFacturas();
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
  };

  todasLasFacturas() {
    this.coTransaccionesServ.getDatos().then((resp: any) => {      
      this.facturas = resp;  
    });
  }
  
  actualizarFactura(data) {
    this.index = 1;   
    this.coTransaccionesServ.actualizando(data);
  }

  borrarFactura(id:number) { 
    this.confirmationService.confirm({
      message:"Esta seguro de anular este registro?",
      accept:() =>{ 
        this.coTransaccionesServ.borrarFactura(id).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }
}