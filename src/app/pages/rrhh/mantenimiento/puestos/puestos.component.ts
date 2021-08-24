import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PuestosService } from 'src/app/services/rrhh/puestos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.scss'],
  providers:[PuestosService]
})
export class PuestosComponent implements OnInit {

  usuario: any;
  index: number = 0;
  puestos: any[] = [];
  id_categoria: any;
  cols: any[];
   

  constructor(private uiMessage: UiMessagesService,
              
              private puestosServ: PuestosService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                ;                
              }

  ngOnInit(): void {
    this.todasLosPuestos();

    this.puestosServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id_puesto', header: 'Código' },
      { field: 'titulo', header: 'Título' },
      { field: 'descripcion', header: 'Desripción' },
      { field: 'sueldo_inicial', header: 'Sueldo Inicial' },
      { field: 'sueldo_actual', header: 'Sueldo Actual' },
      { field: 'acciones', header: 'Acciones' }
    ] 

    this.puestosServ.puestoGuardada.subscribe(()=>{
      this.todasLosPuestos();
    })

    this.puestosServ.puestoBorrada.subscribe(()=>{      
      this.todasLosPuestos();   
    })

    this.puestosServ.puestoAct.subscribe(() => {
      this.todasLosPuestos();
    })
  }

  todasLosPuestos() {
     
    this.puestosServ.getDatos().then((resp: any) => {
       
      this.puestos = resp;
       
    });
  }
  
  actualizarPuesto(data) {
    this.index = 1;   
    this.puestosServ.actualizando(data);
  }

  borrarPuesto(puesto) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.puestosServ.borrarPuesto(puesto).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
