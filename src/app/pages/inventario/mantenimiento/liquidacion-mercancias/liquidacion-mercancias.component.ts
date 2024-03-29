import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PendientesLiquidacionComponent } from 'src/app/components/pendientes-liquidacion/pendientes-liquidacion.component';
import { LiquidacionMercanciasService } from 'src/app/services/inventario/liquidacion-mercancias.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-liquidacion-mercancias',
  templateUrl: './liquidacion-mercancias.component.html',
  styleUrls: ['./liquidacion-mercancias.component.scss']
})
export class LiquidacionMercanciasComponent implements OnInit {

  usuario: any;
  index: number = 0;
  liquidaciones: any[] = [];
  id_categoria: any;
  cols: any[];
  pendientes: any;
  
  constructor(private uiMessage: UiMessagesService,              
              private liquidacionesServ: LiquidacionMercanciasService,
              private confirmationService: ConfirmationService,              
              public dialogService: DialogService) { 
                               
              }

  ngOnInit(): void {   
    this.liquidacionesServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'divisa', header: 'Divisa' },
      { field: 'simbolo', header: 'Símbolo' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.liquidacionesServ.liquidacionGuardada.subscribe((resp: any)=>{
      this.todasLasLiquidaciones();
    })

    this.liquidacionesServ.liquidacionBorrada.subscribe((resp: any)=>{      
      this.todasLasLiquidaciones();   
    })

    this.liquidacionesServ.liquidacionAct.subscribe((resp: any) => {
      this.todasLasLiquidaciones();
    })
  }

  todasLasLiquidaciones() {
    this.liquidacionesServ.getDatos().then((resp: any) => {
      this.liquidaciones = resp;
    });
  }
  
  actualizarLiquidacion(data) {
    this.index = 1;   
    this.liquidacionesServ.actualizando(data);
  }

  borrarCategoria(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.liquidacionesServ.borrarLiquidacion(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }
  
  listadoPendientes(data) {
    ;    
    if (data === 1) {
      this.liquidacionesServ.getDatos().then((resp: any) => {
        if (resp.length !== 0) {
          this.dialogService.open(PendientesLiquidacionComponent, {
            header: 'Entradas Pendientes por Liquidar',
            data: resp,
            width: '50%'
          });     
        }
      })    
    }      
  }
}
