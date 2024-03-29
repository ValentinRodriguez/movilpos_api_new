import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MonedasService } from 'src/app/services/mi-empresa/monedas.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss'],
  providers:[MonedasService]
})
export class CotizacionesComponent implements OnInit {

  usuario: any;
  index: number = 0;
  monedas: any[] = [];
  id_categoria: any;
  cols: any[];
   

  constructor(private uiMessage: UiMessagesService,
              
              private monedasServ: MonedasService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                ;                
              }

  ngOnInit(): void {
    this.todasLasMonedas();

    this.monedasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'divisa', header: 'Divisa' },
      { field: 'moneda', header: 'Moneda' },
      { field: 'simbolo', header: 'Símbolo' },
      { field: 'codigo', header: 'Código' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.monedasServ.monedaGuardada.subscribe((resp: any)=>{
      this.todasLasMonedas();
    })

    this.monedasServ.monedaBorrada.subscribe((resp: any)=>{      
      this.todasLasMonedas();   
    })

    this.monedasServ.monedaAct.subscribe((resp: any) => {
      this.todasLasMonedas();
    })
  }

  todasLasMonedas() {
     
    this.monedasServ.getDatos().then((resp: any) => {
      this.monedas = resp;
       
    });
  }
  
  actualizarMoneda(data) {
    this.index = 1;   
    this.monedasServ.actualizando(data);
  }

  borrarCategoria(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.monedasServ.borrarMoneda(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }
}
