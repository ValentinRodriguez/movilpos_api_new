import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CondicionesPagoService } from 'src/app/services/ventas/condiciones-pago.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-condiciones-pago',
  templateUrl: './condiciones-pago.component.html',
  styleUrls: ['./condiciones-pago.component.scss']
})
export class CondicionesPagoComponent implements OnInit {

  condiciones: any[] = [];
  usuario: any;
  actualizando = false;
  actualizar = false;
  id_categoria: any;
  cols: any[];
   

  constructor(
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private confirmationService: ConfirmationService,
              private condicionServ: CondicionesPagoService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
              }

  ngOnInit(): void {
    this.todasLasCondiciones();

    this.condicionServ.condicionGuardada.subscribe((resp: any) => {
      this.todasLasCondiciones();
    })

    this.condicionServ.condicionBorrada.subscribe((resp: any) => {
      this.todasLasCondiciones();
    })

    this.condicionServ.condicionAct.subscribe((resp: any) => {
      this.todasLasCondiciones();
    })

    this.cols = [
      { field: 'descripcion', header: 'Descripción' },
      { field: 'defecto', header: 'Defecto'},
      { field: 'dias', header: 'Días'},
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  todasLasCondiciones() {
         
    this.condicionServ.getDatos().then((resp: any) =>{
       
      this.condiciones = resp;   
                
    })
  }

  actTipoCondiciones(condicion) {

  }

  borrarTipoCondicion(data) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.condicionServ.borrarCondicion(data).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }
}
