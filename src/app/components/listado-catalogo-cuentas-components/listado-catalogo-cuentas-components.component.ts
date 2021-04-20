import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

@Component({
  selector: 'app-listado-catalogo-cuentas-components',
  templateUrl: './listado-catalogo-cuentas-components.component.html',
  styleUrls: ['./listado-catalogo-cuentas-components.component.scss']
})
export class ListadoCatalogoCuentasComponentsComponent implements OnInit {

  cuentas_no = [];
  cuentasSeleccionadas = [];
  
  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private cgCatalogoServ: CgcatalogoService,
              private uiMessage: UiMessagesService) { }

  ngOnInit(): void {
    this.todosLosCatalogos();
  }
  
  todosLosCatalogos() {
    this.cgCatalogoServ.getDatosAux().then((resp: any) => {      
      this.cuentas_no = resp;
    })
  }

  enviarCatalogo() {
    if (this.cuentasSeleccionadas.length !== 0) {        
      this.cgCatalogoServ.listadocatalogoEscogidos(this.cuentasSeleccionadas);
      this.ref.close();      
    } else {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe escoger al menos una cuenta');
    }
  }

}
