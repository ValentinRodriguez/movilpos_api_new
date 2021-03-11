import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CoTransaccionescxpService } from 'src/app/services/co-transaccionescxp.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-transaccionescxp',
  templateUrl: './transaccionescxp.component.html',
  styleUrls: ['./transaccionescxp.component.scss']
})
export class TransaccionescxpComponent implements OnInit {

  usuario: any;
  index: number = 0;
  facturas: any[] = [];
  id_categoria: any;
  cols: any[];
  loading: boolean;

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private coTransaccionesServ: CoTransaccionescxpService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService,
              @Inject(DOCUMENT) private document: Document) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todasLasFacturas();

    this.coTransaccionesServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

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
    
    this.coTransaccionesServ.facturaGuardada.subscribe((resp: any)=>{
      this.todasLasFacturas();
    })

    this.coTransaccionesServ.facturaBorrada.subscribe((resp: any)=>{      
      this.todasLasFacturas();   
    })

    this.coTransaccionesServ.facturaAct.subscribe((resp: any) => {
      this.todasLasFacturas();
    })
  }

  todasLasFacturas() {
    this.loading = true;
    this.coTransaccionesServ.getDatos().then((resp: any) => {      
      this.facturas = resp;
      this.loading = false;
    });
  }
  
  actualizarFactura(data) {
    this.index = 1;   
    this.coTransaccionesServ.actualizando(data);
  }

  borrarFactura(id:number) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.coTransaccionesServ.borrarFactura(id).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }
}
