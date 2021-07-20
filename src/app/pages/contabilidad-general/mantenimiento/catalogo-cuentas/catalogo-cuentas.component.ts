import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CgcatalogoService } from 'src/app/services/contabilidad/cgcatalogo.service';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-catalogo-cuentas',
  templateUrl: './catalogo-cuentas.component.html',
  styleUrls: ['./catalogo-cuentas.component.scss']
})
export class CatalogoCuentasComponent implements OnInit {

  usuario: any; 
  cuentas: any[] = [];
  actualizando = false;
  actualizar = false;
  id_categoria: any;
  cols: any[];
  data: any[] = [];
  index: number = 0;
    
  listSubscribers: any = [];

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private cgcatalogoServ: CgcatalogoService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService,
              public datos: DatosEstaticosService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.todosLosCatalogos();
              }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {    
    this.listObserver();
    this.cols = [
      { field: 'descripcion_c', header: 'Descripción'},
      { field: 'cuenta_no', header: 'Cuenta'},
      { field: 'origen', header: 'Origen'},
      { field: 'aplica_a', header: 'Cuenta Aplica'},
      { field: 'tipo_cuenta', header: 'Tipo Cuenta'},
      { field: 'codigo_isr', header: 'Código ISR'},
      { field: 'catalogo', header: 'Catálogo'},
      { field: 'referencia', header: 'Referencia'},
      { field: 'depto', header: 'Departamento'},
      { field: 'selectivo_consumo', header: 'Selectivo Consumo'},
      { field: 'retencion', header: 'Retención'},
      { field: 'acciones', header: 'Acciones'},
    ]
  }

  listObserver = () => {
    const observer1$ = this.cgcatalogoServ.guardar.subscribe((resp: any)=>{      
      this.index = resp;
    })

    const observer2$ = this.cgcatalogoServ.catalogoGuardado.subscribe(()=>{
      this.todosLosCatalogos();
    })

    const observer3$ = this.cgcatalogoServ.catalogoActualizado.subscribe(()=>{      
      this.todosLosCatalogos();   
    })

    const observer4$ = this.cgcatalogoServ.catalogoBorrado.subscribe(() => {
      this.todosLosCatalogos();
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
  };

  todosLosCatalogos() {
    this.cgcatalogoServ.getDatos().then((resp: any) => {
      this.cuentas = resp;
    })
  }

  actualizarCatalogo(data) {
    this.index = 1;   
    this.cgcatalogoServ.actualizando(data);
  }

  borrarTransportista(transportista) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.cgcatalogoServ.borrarCatalogo(transportista).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
