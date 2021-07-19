import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TransportistasService } from 'src/app/services/transportistas.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-transportistas',
  templateUrl: './transportistas.component.html',
  styleUrls: ['./transportistas.component.scss']
})
export class TransportistasComponent implements OnInit {

  usuario: any;
  index: number = 0;
  transportistas: any[] = [];
  actualizando = false; 
  actualizar = false;
  id_categoria: any;
  cols: any[];   
    
  listSubscribers: any = [];

  constructor(private globalFunction: GlobalFunctionsService,private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private transportistasServ: TransportistasService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.todosLosTransportistas();
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
    this.cols = [
      { field: 'nombre', header: 'Nombre'},
      { field: 'cedula', header: 'Cédula'},
      { field: 'cod_transportista', header: 'Nivel'},
      { field: 'sec_transp', header: 'Código'},
      { field: 'telefono', header: 'Teléfono'},
      { field: 'acciones', header: 'Acciones'},
    ]
  }

  listObserver = () => {
    const observer1$ = this.transportistasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    const observer2$ = this.transportistasServ.trasnportistaAct.subscribe((resp: any) => {
      this.todosLosTransportistas();
    })
    
    const observer3$ = this.transportistasServ.trasnportistaGuardado.subscribe((resp: any)=>{
      this.todosLosTransportistas();
    })
    
    const observer4$ = this.transportistasServ.trasnportistaBorrado.subscribe((resp: any)=>{      
      this.todosLosTransportistas();   
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
   };

  todosLosTransportistas() {        
    this.transportistasServ.getDatos().then((resp: any) => {
      this.transportistas = resp;     
    })
  }

  actualizarTransportista(data) {
    this.index = 1;   
    this.transportistasServ.actualizando(data);
  }

  borrarTransportista(transportista) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.transportistasServ.borrarTransportista(transportista).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
