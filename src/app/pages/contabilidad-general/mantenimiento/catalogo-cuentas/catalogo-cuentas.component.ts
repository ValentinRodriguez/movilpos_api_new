import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CgcatalogoService } from 'src/app/services/contabilidad/cgcatalogo.service';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

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
              private cgcatalogoServ: CgcatalogoService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService,
              public datos: DatosEstaticosService) { 
                this.todosLosCatalogos();
              }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {    
    this.listObserver();
    this.cols = [
      { field: 'descripcion', header: 'Descripción'},
      { field: 'cuenta_no', header: 'Cuenta'},
      { field: 'origen', header: 'Origen'},
      { field: 'aplica_a', header: 'Cuenta Aplica'},
      { field: 'tipo_cuenta', header: 'Tipo Cuenta'},
      { field: 'catalogo', header: 'Catálogo'},
      { field: 'referencia', header: 'Referencia'},
      { field: 'depto', header: 'Departamento'},
      { field: 'selectivo_consumo', header: 'Selectivo Consumo'},
      { field: 'retencion', header: 'Retención'},
      { field: 'cuenta_resultado', header: 'Cuenta Resultados'},
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
    this.cgcatalogoServ.getDatos().subscribe((resp: any) => {
      console.log(resp);
      
      if (resp.ok) {
        this.cuentas = resp.data;        
      }
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
        this.cgcatalogoServ.borrarCatalogo(transportista).subscribe((resp: any)=>{
          if (resp.ok) {
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');               
          }
        })       
      }
    })
  }

}
