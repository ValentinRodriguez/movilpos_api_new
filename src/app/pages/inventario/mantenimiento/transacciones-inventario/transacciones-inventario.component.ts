import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TransaccionesService } from 'src/app/services/inventario/transacciones.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

import { environment } from 'src/environments/environment';
import { UsuarioService } from '../../../../services/panel-control/usuario.service';

const URL = environment.url;
@Component({
  selector: 'app-transacciones-inventario',
  templateUrl: './transacciones-inventario.component.html',
  styleUrls: ['./transacciones-inventario.component.scss'],
  providers:[TransaccionesService]
})
export class TransaccionesInventarioComponent implements OnInit {

  usuario: any;
  transacciones:any[] = [];
  facturas
  cols: any[] = [];  
  listSubscribers: any = [];
  index = 0;
  items: MenuItem[] = [];

  constructor(private transaccionesServ: TransaccionesService,              
              private uiMessage: UiMessagesService,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private usuarioServ: UsuarioService,
              @Inject(DOCUMENT) private document: Document) {  
                this.usuario = this.usuarioServ.getUserLogged();
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todasLastransacciones();
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

    const observer3$ = this.transaccionesServ.finalizar.subscribe((resp) => {
      this.index = resp;
    })

    this.listSubscribers = [observer1$,observer2$,observer3$];
  };

  todasLastransacciones() {     
    this.transaccionesServ.getDatos().subscribe((resp: any)=>{      
      this.transacciones = resp.data;            
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
        this.transaccionesServ.borrarTransaccion(id).subscribe((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');  
        })      
      }
    })  
  }
  
}
