import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { BodegasPermisosComponent } from 'src/app/pages/inventario/mantenimiento/bodegas/bodegas-permisos/bodegas-permisos.component';
import { BodegasService } from 'src/app/services/inventario/bodegas.service';
import { PaisesCiudadesService } from 'src/app/services/globales/paises-ciudades.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.component.html',
  styleUrls: ['./bodegas.component.scss'],
  providers:[BodegasService,UsuarioService,PaisesCiudadesService]
})
export class BodegasComponent implements OnInit {
  
  @ViewChild('dt') table: Table;
  formaAct: FormGroup;
  bodegas = [];
  paises: any[] = [];  
  usuario: any;
  permisos = false;
  id_bodega: any;
  cols: any[];   
  index: number = 0;
    
  listSubscribers: any = [];

  constructor(private bodegasServ: BodegasService,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService,
              private paisesCiudadesServ: PaisesCiudadesService) { 
                this.usuario = this.usuariosServ.getUserLogged();
              }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todasLasBodegas();
    this.todosLosPaises();
    this.listObserver();
    this.cols = [
      { field: 'descripcion', header: 'Bodega' },
      { field: 'id_bodega', header: 'Código' },
      { field: 'pais', header: 'Pais' },
      { field: 'ciudad', header: 'Ciudad' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }  

  listObserver = () => {
    const observer1$ = this.bodegasServ.bodegaActualizada.subscribe(() => {
      this.todasLasBodegas();      
    })

    const observer2$ = this.bodegasServ.bodegaGuardada.subscribe(()=>{
      this.todasLasBodegas();
    })

    const observer3$ = this.bodegasServ.bodegaBorrada.subscribe(()=>{      
      this.todasLasBodegas();    
    })
    
    const observer4$ = this.bodegasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })
  
    this.listSubscribers = [observer1$, observer2$, observer3$, observer4$];
  };

  todasLasBodegas() {         
    this.bodegasServ.getDatos().then((resp: any ) => {
      this.bodegas = resp;       
    })
  }

  todosLosPaises() {
    this.paisesCiudadesServ.getPaises().then((resp: any)=>{
      this.paises = resp;   
    })
  }
 
  borrarBodega(bodega) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.bodegasServ.borrarBodega(bodega).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

  actualizarBodega(data) {
    this.index = 1;   
    this.bodegasServ.actualizando(data);
  }

  permisosBodegas(id: string) {
     this.dialogService.open(BodegasPermisosComponent, {
      data: {
        bodega: id
      },
      header: 'Gestión de permisos a bodegas',
      width: '50%'
    });
  }
}
