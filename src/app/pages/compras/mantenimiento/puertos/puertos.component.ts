import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PuertosService } from 'src/app/services/puertos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-puertos',
  templateUrl: './puertos.component.html',
  styleUrls: ['./puertos.component.scss']
})
export class PuertosComponent implements OnInit {

  usuario: any;
  index: number = 0;
  puerto: any[] = [];
  cols: any[];
  loading: boolean;

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private puertosService: PuertosService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todosLospuertos();

    this.puertosService.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'dias', header: 'Días' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.puertosService.puertoGuardada.subscribe((resp: any)=>{
      this.todosLospuertos();
    })

    this.puertosService.puertoBorrada.subscribe((resp: any)=>{      
      this.todosLospuertos();   
    })

    this.puertosService.puertoActualizada.subscribe((resp: any) => {
      this.todosLospuertos();
    })
  }

  todosLospuertos() {
    this.loading = true;
    this.puertosService.getDatos().then((resp: any) => {
      this.puerto = resp;
      this.loading = false;
    });
  }
  
  actualizarPuerto(data) {
    this.index = 1;   
    this.puertosService.actualizando(data);
  }

  borrarPuerto(puerto) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.puertosService.borrarPuerto(puerto).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }


}
