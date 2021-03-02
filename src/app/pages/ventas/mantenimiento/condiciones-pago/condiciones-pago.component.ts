import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CondicionesPagoService } from 'src/app/services/condiciones-pago.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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
  loading: boolean;

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
    this.loading = true;    
    this.condicionServ.getDatos().then((resp: any) =>{
      this.loading = false;
      this.condiciones = resp;   
      console.log(resp);         
    })
  }

  actTipoCondiciones(condicion) {

  }

  borrarTipoCondicion(data) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.condicionServ.borrarCondicion(data).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }
}
