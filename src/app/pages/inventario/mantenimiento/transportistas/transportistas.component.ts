import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TransportistasService } from 'src/app/services/transportistas.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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
  loading: boolean;
  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private transportistasServ: TransportistasService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.todosLosTransportistas();
              }

  ngOnInit(): void {
    
    this.cols = [
      { field: 'nombre', header: 'Nombre'},
      { field: 'cedula', header: 'Cédula'},
      { field: 'cod_transportista', header: 'Nivel'},
      { field: 'sec_transp', header: 'Código'},
      { field: 'telefono', header: 'Teléfono'},
      { field: 'acciones', header: 'Acciones'},
    ] 

    this.transportistasServ.trasnportistaGuardado.subscribe((resp: any)=>{
      this.todosLosTransportistas();
    })

    this.transportistasServ.trasnportistaBorrado.subscribe((resp: any)=>{      
      this.todosLosTransportistas();   
    })

    this.transportistasServ.trasnportistaAct.subscribe((resp: any) => {
      this.todosLosTransportistas();
    })

    this.transportistasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })
  }

  todosLosTransportistas() {
    this.loading = true;    
    this.transportistasServ.getDatos().then((resp: any) => {
      this.transportistas = resp;
      this.loading = false;
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
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }

}
