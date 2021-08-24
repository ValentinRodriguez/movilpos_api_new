import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { RecepcionVehiculosService } from 'src/app/services/ventas/recepcion-vehiculos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-recepcion-vehiculos',
  templateUrl: './recepcion-vehiculos.component.html',
  styleUrls: ['./recepcion-vehiculos.component.scss'],
  providers:[RecepcionVehiculosService]
})
export class RecepcionVehiculosComponent implements OnInit {

  usuario: any;
  index: number = 0;
  recepcion: any[] = [];
  id_categoria: any;
  cols: any[];
  constructor(private uiMessage: UiMessagesService,
              
              private recepcionServ: RecepcionVehiculosService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) {}

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
