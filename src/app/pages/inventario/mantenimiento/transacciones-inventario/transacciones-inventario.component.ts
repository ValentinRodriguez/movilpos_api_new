import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PendientesEntradaComponent } from 'src/app/components/pendientes-entrada/pendientes-entrada.component';
import { TransaccionesService } from 'src/app/services/transacciones.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Component({
  selector: 'app-transacciones-inventario',
  templateUrl: './transacciones-inventario.component.html',
  styleUrls: ['./transacciones-inventario.component.scss']
})
export class TransaccionesInventarioComponent implements OnInit {

  usuario: any;
  transacciones:any[] = [];
  facturas
  cols: any[] = [];
    formSubmitted = false;
  listSubscribers: any = [];


 
 
 

 
  
  constructor(private transaccionesServ: TransaccionesService,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              public dialogService: DialogService,
              @Inject(DOCUMENT) private document: Document,
              private confirmationService: ConfirmationService) {  
                this.usuario = this.usuariosServ.getUserLogged();
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todasLastransacciones();
    this.pendientesEntrada();
    this.listObserver();

    this.cols = [
      { field: 'num_doc', header: 'Documento' },
      { field: 'titulo_mov', header: 'Movimiento' },
      { field: 'comentario', header: 'Comentario' },
      { field: 'condicion_recibo', header: 'Recibido' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'acciones', header: 'Acciones' },
    ]  
  }

  listObserver = () => {
    const observer1$ = this.transaccionesServ.transaccionGuardado.subscribe(() => {
      this.todasLastransacciones();
    })   

    const observer2$ = this.transaccionesServ.transaccionBorrada.subscribe(() => {
      this.todasLastransacciones();
    }) 

    const observer5$ = this.transaccionesServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$,observer5$,observer2$];
  };

  todasLastransacciones() {     
    this.transaccionesServ.getDatos().then((resp: any)=>{      
      this.transacciones = resp;
    })
  }
  
  imprimirTransaccion(num_doc) { 
 
  }  

  actualizarTransaccion() {

  }
  
  verTransaccion(transaccion) {

  }

  borrarTransaccion(id) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{
        this.transaccionesServ.borrarTransaccion(id).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);  
        })      
      }
    })  
  }
  

  pendientesEntrada() : void {    
    this.transaccionesServ.transaccionesPendientes(this.usuario.email).then((resp: any) => {    
      if (resp.length !== 0) {
        const ref = this.dialogService.open(PendientesEntradaComponent, {
          data: { lista: resp },
          header: `Listado de direcciones`,
          width: '80%'
        });        
      }
    })
  }
}
