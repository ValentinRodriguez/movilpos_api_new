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
  loading: boolean;
  
  constructor(private transaccionesServ: TransaccionesService,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              public dialogService: DialogService,
              @Inject(DOCUMENT) private document: Document,
              private confirmationService: ConfirmationService) {  
                this.usuario = this.usuariosServ.getUserLogged();
              }
  
  ngOnInit(): void {
    this.todasLastransacciones();
    this.pendientesEntrada();

    this.transaccionesServ.transaccionGuardado.subscribe(() => {
      this.todasLastransacciones();
    })   

    this.transaccionesServ.transaccionBorrada.subscribe(() => {
      this.todasLastransacciones();
    }) 

    this.cols = [
      { field: 'num_doc', header: 'Documento' },
      { field: 'titulo_mov', header: 'Movimiento' },
      { field: 'comentario', header: 'Comentario' },
      { field: 'condicion_recibo', header: 'Recibido' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'acciones', header: 'Acciones' },
    ]  
  }

  todasLastransacciones() {
    this.loading = true;
    this.transaccionesServ.getDatos().then((resp: any)=>{      
      this.transacciones = resp;
      this.loading = false;
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
