import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

@Component({
  selector: 'app-listado-direcciones',
  templateUrl: './listado-direcciones.component.html',
  styleUrls: ['./listado-direcciones.component.scss']
})
export class ListadoDireccionesComponent implements OnInit {
  direcciones: any[] = [];
  direccioneSeleccionada = [];
  productos: any[] = [];
  cols: any[];
   

  constructor(private direccionServ: DireccionesService,
              private ref: DynamicDialogRef,
              private uiMessage: UiMessagesService) { }

  ngOnInit(): void {
    this.todasLasDirecciones();

    this.cols = [
      { field: 'esc', header: '#' },
      { field: 'nombre', header: 'Entregar A' },
      { field: 'pais', header: 'País' },
      { field: 'ciudad', header: 'Ciudad' },
      { field: 'direccion_a', header: 'Dirección 1' },
      { field: 'direccion_b', header: 'Dirección 2' },
      { field: 'telefono', header: 'Teléfono' }
    ] 
  }

  todasLasDirecciones() {
         
    this.direccionServ.getDatos().then((resp: any) => {
      this.direcciones = resp;      
       
    })
  }
  
  enviarDireccion() {
    if (this.direccioneSeleccionada.length !== 0) {   
      this.direccionServ.direccionEscogidas(this.direccioneSeleccionada);
      this.ref.close();      
    } else {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe escoger al menos una cuenta');
    }
  }

}
