import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { EstadosService } from 'src/app/services/contabilidad/estados.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent implements OnInit {

  cols: any;
  listsubcriber: any = [];
  index: number = 0;
  estados: any[] = [];
  
  constructor(private estadosServ: EstadosService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService,
              private uiMessage: UiMessagesService) { }

  ngOnInit(): void {

    this.estadosServ.guardar.subscribe((id: any) => {
      this.index = id;
    });

    this.estadosServ.llamarEstado.subscribe((id: any) => {
      this.getEstados();
    });

    this.cols = [
      { field: 'descripcion_esp', header: 'Descripción Espanol'},
      { field: 'descripcion_ing', header: 'Descripcion Ingles'},
      { field: 'id_estado', header: 'ID Estado'},
      { field: 'grupo', header: 'Grupo'},
      { field: 'orden_grupo', header: 'Orden'},
      { field: 'tipo_estado', header: 'Tipo Estado'},
      { field: 'signo', header: 'Signo' },
      { field: 'acciones', header: 'Acciones'}  
    ]
    this.getEstados();
  }

  getEstados() {
    this.estadosServ.getDatos().subscribe((resp: any) => {
      if (resp.code === 200) {
        this.estados = resp.data
      }     
    })
  }

  actualizarEstado(id) {
    this.index = 1;   
    this.estadosServ.actualizando(id);
  }

  borrarEstado(id: string) {
    console.log(id);
    
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.estadosServ.borrarEstado(id).subscribe((resp: any) => {
          if (resp.code === 200) {
            this.estadosServ.llamarEstado.emit(true);
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');
          }
        })       
      }
    })
  }
}
