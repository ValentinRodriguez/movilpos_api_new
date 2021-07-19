import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { RecepcionVehiculosService } from 'src/app/services/recepcion-vehiculos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-recepcion-vehiculos',
  templateUrl: './recepcion-vehiculos.component.html',
  styleUrls: ['./recepcion-vehiculos.component.scss']
})
export class RecepcionVehiculosComponent implements OnInit {

  usuario: any;
  index: number = 0;
  recepcion: any[] = [];
  id_categoria: any;
  cols: any[];
   

  constructor(private globalFunction: GlobalFunctionsService,private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private recepcionServ: RecepcionVehiculosService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todasLasRecepcion();

    this.recepcionServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })
    
    this.cols = [
      { field: 'imagen', header: 'Producto' },
      { field: 'nombre_cliente', header: 'Cliente' },
      { field: 'recibido', header: 'Recibido' },
      { field: 'entregado', header: 'Entregado' },
      { field: 'fecha_entrega', header: 'Fecha Entrega' },
      { field: 'marca', header: 'Marca' },
      { field: 'categoria', header: 'Modelo' },
      { field: 'color', header: 'Color' },
      { field: 'placa', header: 'Placa' },
      { field: 'tipo_producto', header: 'Tipo Producto' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.recepcionServ.recepcionGuardada.subscribe(()=>{
      this.todasLasRecepcion();
    })

    this.recepcionServ.recepcionBorrada.subscribe(()=>{      
      this.todasLasRecepcion();   
    })

    this.recepcionServ.recepcionAct.subscribe(() => {
      this.todasLasRecepcion();
    })
  }

  todasLasRecepcion() {
    this.recepcionServ.getDatos().then((resp: any) => {
      console.log(resp);      
      this.recepcion = resp;
    });
  }
  
  actualizarRecepcion(data) {
    this.index = 1;   
    this.recepcionServ.actualizando(data);
  }

  borrarRecepcion(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.recepcionServ.borrarRecepcion(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
