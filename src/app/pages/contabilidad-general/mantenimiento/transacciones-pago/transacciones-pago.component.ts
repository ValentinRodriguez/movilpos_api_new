import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TransacionPagosService } from 'src/app/services/transacion-pagos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
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
  
  listSubscribers: any = [];

  constructor(private globalFunction: GlobalFunctionsService,private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private cgTransaccionesServ: TransacionPagosService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todasLasCuentas();
    this.listObserver();

    this.cols = [
      { field: 'fecha', header: 'fecha' },
      { field: 'tipo_doc', header: 'Tipo' },
      { field: 'cuenta_banco', header: 'Cuenta Banco' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  listObserver = () => {
    const observer1$ = this.cgTransaccionesServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    const observer2$ = this.cgTransaccionesServ.transaccionGuardada.subscribe(()=>{
      this.todasLasCuentas();
    })

    const observer3$ = this.cgTransaccionesServ.transaccionAct.subscribe(()=>{      
      this.todasLasCuentas();   
    })

    const observer4$ = this.cgTransaccionesServ.transaccionBorrada.subscribe(() => {
      this.todasLasCuentas();
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
   };

  todasLasCuentas() {
    this.cgTransaccionesServ.getDatos().then((resp: any) => {             
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
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');   
        })       
      }
    })
  }
}
