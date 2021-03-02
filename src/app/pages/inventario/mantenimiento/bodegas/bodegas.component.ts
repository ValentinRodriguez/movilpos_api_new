import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { BodegasPermisosComponent } from 'src/app/pages/inventario/mantenimiento/bodegas/bodegas-permisos/bodegas-permisos.component';
import { BodegasService } from 'src/app/services/bodegas.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.component.html',
  styleUrls: ['./bodegas.component.scss']
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
  loading: boolean;
  index: number = 0;

  constructor(private bodegasServ: BodegasService,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService,
              private paisesCiudadesServ: PaisesCiudadesService) { 
                this.usuario = this.usuariosServ.getUserLogged();
              }

  ngOnInit(): void {
    this.todasLasBodegas();
    this.todosLosPaises();
    
    this.cols = [
      { field: 'descripcion', header: 'Bodega' },
      { field: 'id_bodega', header: 'Código' },
      { field: 'pais', header: 'Pais' },
      { field: 'ciudad', header: 'Ciudad' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.bodegasServ.bodegaActualizada.subscribe(resp => {
      this.todasLasBodegas();      
    })

    this.bodegasServ.bodegaGuardada.subscribe((resp: any)=>{
      this.todasLasBodegas();
    })
    
    this.bodegasServ.bodegaBorrada.subscribe((resp: any)=>{      
      this.todasLasBodegas();    
    })
    
    this.bodegasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })
  }  

  todasLasBodegas() {
    this.loading = true;    
    this.bodegasServ.getDatos().then((resp: any ) => {
      this.bodegas = resp;
      this.loading = false;
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
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }

  actualizarBodega(data) {
    this.index = 1;   
    this.bodegasServ.actualizando(data);
  }

  permisosBodegas(id: string) {
    const ref = this.dialogService.open(BodegasPermisosComponent, {
      data: {
        bodega: id
      },
      header: 'Gestión de permisos a bodegas',
      width: '50%'
    });
  }
}
