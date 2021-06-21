import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TurnosService } from 'src/app/services/turnos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {

  usuario: any;
  index: number = 0;
  turnos: any[] = [];
  id_categoria: any;
  cols: any[];   

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private turnosServ: TurnosService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todasLasTurnos();

    this.turnosServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descrpción' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.turnosServ.turnoGuardada.subscribe((resp: any)=>{
      this.todasLasTurnos();
    })

    this.turnosServ.turnoBorrada.subscribe((resp: any)=>{      
      this.todasLasTurnos();   
    })

    this.turnosServ.turnoAct.subscribe((resp: any) => {
      this.todasLasTurnos();
    })
  }

  todasLasTurnos() {
    this.turnosServ.getDatos().then((resp: any) => {
      this.turnos = resp;
    });
  }
  
  actualizarTurno(data) {
    this.index = 1;   
    this.turnosServ.actualizando(data);
  }

  borrarCategoria(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.turnosServ.borrarTurno(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
