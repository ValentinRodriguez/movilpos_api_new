import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DgiiService } from 'src/app/services/dgii.service';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-listado-rnc',
  templateUrl: './listado-rnc.component.html',
  styleUrls: ['./listado-rnc.component.scss']
})
export class ListadoRncComponent implements OnInit {

  rncs: any[] = [];
  direccioneSeleccionada = [];
  productos: any[] = [];
  cols: any[];   
  
  constructor(private globalFunction: GlobalFunctionsService,private ref: DynamicDialogRef,
              private dgiiServ: DgiiService,
              private uiMessage: UiMessagesService) { }

  ngOnInit(): void {
    this.todaladata();

    this.cols = [
      // { field: 'esc', header: '#' },
      { field: 'rnc', header: 'RNC' },
      { field: 'razon_social', header: 'Razón Social' },
      { field: 'nombre_empresa', header: 'Nombre Empresa' },
      { field: 'actividad', header: 'Actividad' },
      { field: 'fecha_inicio', header: 'Fecha Inicio' },
      { field: 'estado1', header: 'Estado' }
    ] 
  }
  
  todaladata() {    
         
    this.dgiiServ.getRNCS().then((resp: any)=>{
      this.rncs = resp;    
    })
  }
  
  enviarDireccion(data) {
    console.log(data.data);
    this.dgiiServ.rncEscogidos(data.data);
    this.uiMessage.getMiniInfortiveMsg('tst','infor','ERROR','RNC escogido');
    // this.ref.close();      
    // if (this.direccioneSeleccionada.length !== 0) {   
    // } else {
    // }
  }
}
