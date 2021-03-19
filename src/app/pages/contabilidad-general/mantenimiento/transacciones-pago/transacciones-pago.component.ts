import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TransacionPagosService } from 'src/app/services/transacion-pagos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-transacciones-pago',
  templateUrl: './transacciones-pago.component.html',
  styleUrls: ['./transacciones-pago.component.scss']
})
export class TransaccionesPagoComponent implements OnInit {

  usuario: any;
  index: number = 0;
  cuentas: any[] = [];
  id_categoria: any;
  cols: any[];
  loading: boolean;

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private cgTransaccionesServ: TransacionPagosService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todasLasCuentas();

    this.cgTransaccionesServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'fecha', header: 'fecha' },
      { field: 'tipo_doc', header: 'Tipo' },
      { field: 'cuenta_banco', header: 'Cuenta Banco' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.cgTransaccionesServ.transaccionGuardada.subscribe((resp: any)=>{
      this.todasLasCuentas();
    })

    this.cgTransaccionesServ.transaccionAct.subscribe((resp: any)=>{      
      this.todasLasCuentas();   
    })

    this.cgTransaccionesServ.transaccionBorrada.subscribe((resp: any) => {
      this.todasLasCuentas();
    })
  }

  todasLasCuentas() {
    this.cgTransaccionesServ.getDatos().then((resp: any) => {
      console.log(resp);      
      this.cuentas = resp;
    });
  }
  
  actualizarTransaccion(data) {
    this.index = 1;   
    this.cgTransaccionesServ.actualizando(data);
  }

  borrarTransaccion(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.cgTransaccionesServ.borrarTransaccion(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }


}
