import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MonedasService } from 'src/app/services/mi-empresa/monedas.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

@Component({
  selector: 'app-tabla-amortizaciones',
  templateUrl: './tabla-amortizaciones.component.html',
  styleUrls: ['./tabla-amortizaciones.component.scss'],
  providers:[UsuarioService,MonedasService]
})
export class TablaAmortizacionesComponent implements OnInit {

  usuario: any;
  index: number = 0;
  monedas: any[] = [];
  id_categoria: any;
  cols: any[];
   

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private monedasServ: MonedasService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todasLasMonedas();

    this.monedasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'divisa', header: 'Divisa' },
      { field: 'simbolo', header: 'Símbolo' },
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
