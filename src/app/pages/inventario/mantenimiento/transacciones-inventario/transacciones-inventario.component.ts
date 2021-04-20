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
  index = 0;
  
  constructor(private transaccionesServ: TransaccionesService,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              @Inject(DOCUMENT) private document: Document) {  
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

    const observer3$ = this.transaccionesServ.finalizar.subscribe((resp) => {
      this.index = resp;
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer5$];
  };

  todasLastransacciones() {     
    this.transaccionesServ.getDatos().then((resp: any)=>{      
      this.transacciones = resp;
    })
  }
  
  imprimirTransaccion(num_doc) { 
    const link = this.document.createElement('a');
    link.target = '_blank';
    link.href = `${URL}/reporte/invtransacciones-visualizar/${num_doc}/${this.usuario.id}`;
    link.click();
    link.remove();
  }  
  
  verTransaccion(transaccion) {

  }

  borrarTransaccion(id) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{
        this.transaccionesServ.borrarTransaccion(id).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');  
        })      
      }
    })  
  }
  

  pendientesEntrada() : void {    
    this.transaccionesServ.transaccionesPendientes(this.usuario.email).then((resp: any) => {    
      if (resp.length !== 0) {
         this.dialogService.open(PendientesEntradaComponent, {
          data: { lista: resp },
          header: `Listado de direcciones`,
          width: '80%'
        });        
      }
    })
  }
}
