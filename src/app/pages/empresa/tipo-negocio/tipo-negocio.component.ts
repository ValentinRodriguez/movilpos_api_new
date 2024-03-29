import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TipoNegocioService } from 'src/app/services/mi-empresa/tipo-negocio.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-tipo-negocio',
  templateUrl: './tipo-negocio.component.html',
  styleUrls: ['./tipo-negocio.component.scss'],
  providers:[TipoNegocioService,]
})
export class TipoNegocioComponent implements OnInit {

  tipoNegocios: any[] = [];
  usuario: any;
  actualizando = false;
  actualizar = false;
  id_categoria: any;
  cols: any[];   
  index: number = 0;
  
  constructor(
              private uiMessage: UiMessagesService,              
              private confirmationService: ConfirmationService,
              private tipoNegocioServ: TipoNegocioService,
              public dialogService: DialogService) { 
                ;
              }

  ngOnInit(): void {
    this.obtenerTipoNegocios();

    this.tipoNegocioServ.tipoNegocioguardado.subscribe((resp: any) => {
      this.obtenerTipoNegocios();
    })

    this.tipoNegocioServ.tipoNegocioBorrado.subscribe((resp: any) => {
      this.obtenerTipoNegocios();
    })

    this.tipoNegocioServ.tipoNegocioAct.subscribe((resp: any) => {
       
      this.obtenerTipoNegocios();
    })

    this.tipoNegocioServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })
    
    this.cols = [
      { field: 'tipo_negocio', header: 'Tipo' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  obtenerTipoNegocios() {
     
    this.tipoNegocioServ.getDatos().then((resp: any) =>{
      this.tipoNegocios = resp;  
    })
  }

  actTipoNegocio(data) {
    this.index = 1;   
    this.tipoNegocioServ.actualizando(data);
  }

  borrarTipoNegocio(data) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.tipoNegocioServ.borrarTipoNegocio(data).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }
}
