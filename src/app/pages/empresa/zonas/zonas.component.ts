import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';
import { ZonasService } from 'src/app/services/mi-empresa/zonas.service';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.scss']
})
export class ZonasComponent implements OnInit {

  usuario: any;
  index: number = 0;
  zonas: any[] = [];
  id_categoria: any;
  cols: any[];   
  
  
  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private zonasServ: ZonasService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todasLasZonas();

    this.zonasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.zonasServ.zonaGuardada.subscribe((resp: any)=>{
      this.todasLasZonas();
    })

    this.zonasServ.zonaBorrada.subscribe((resp: any)=>{      
      this.todasLasZonas();   
    })

    this.zonasServ.zonaAct.subscribe((resp: any) => {
      this.todasLasZonas();
    })
  }

  todasLasZonas() {
    this.zonasServ.getDatos().then((resp: any) => {
      this.zonas = resp;
      
      
    });
  }
  
  actualizarMoneda(data) {
    this.index = 1;   
    this.zonasServ.actualizando(data);
  }

  borrarZona(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.zonasServ.borrarZona(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
