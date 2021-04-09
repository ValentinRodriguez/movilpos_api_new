import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

@Component({
  selector: 'app-catalogo-cuentas',
  templateUrl: './catalogo-cuentas.component.html',
  styleUrls: ['./catalogo-cuentas.component.scss']
})
export class CatalogoCuentasComponent implements OnInit {
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
