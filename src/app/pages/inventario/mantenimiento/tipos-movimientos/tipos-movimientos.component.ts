import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MovimientoPermisosComponent } from 'src/app/pages/inventario/mantenimiento/tipos-movimientos/movimiento-permisos/movimiento-permisos.component';
import { CodMovService } from 'src/app/services/inventario/cod-mov.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

@Component({
  selector: 'app-tipos-movimientos',
  templateUrl: './tipos-movimientos.component.html',
  styleUrls: ['./tipos-movimientos.component.scss'],
  providers:[CodMovService]
})

export class TiposMovimientosComponent implements OnInit {
  forma: FormGroup;
  usuario: any;
  cuentas_permisos: any[] = []; 
  movimientos: any[] = [];
  cuentas_mov: any[] = [];
  usuarios_mov: any[] = [];
  cuentasMov: any[] = [];
  cuentasPermisos: any[] = []
  catalogos = false;
  movimientoExiste = 3;
  id_mov: any;
  mov_nombre: any
  index: number = 0;
  cols:any = [];
  cols2: { field: string; header: string; }[];
    
  listSubscribers: any = [];
  
  constructor(private uiMessage: UiMessagesService,              
              public dialogService: DialogService,             
              private confirmationService: ConfirmationService,
              private CodMovServ: CodMovService,
              ) { }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
    this.todosLosMov();     
        
    this.cols = [
      { field: 'titulo', header: 'Titulo' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'origen', header: 'Origen' },
      { field: 'control_clientes', header: 'Clientes' },
      { field: 'control_despachos', header: 'Despachos' },
      { field: 'control_departamento', header: 'Departamento' },
      { field: 'control_devoluciones', header: 'Devoluciones' },
      { field: 'control_transferencia', header: 'Transferencia' },
      { field: 'control_orden_compra', header: 'Compra' },
      { field: 'acciones', header: 'Acciones' },
    ]
  }

  listObserver = () => {
    const observer1$ = this.CodMovServ.tipoMovBorrado.subscribe(()=>{      
      this.todosLosMov();
    })

    const observer2$ = this.CodMovServ.tipoMovGuardado.subscribe(()=>{
      this.todosLosMov();
    })

    const observer3$ = this.CodMovServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    const observer4$=this.CodMovServ.tipoMovActualizado.subscribe(()=>{
      this.todosLosMov();
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
  };

  todosLosMov() {  
    this.CodMovServ.getDatos().subscribe((resp: any) => {
      console.log(resp);      
      if (resp.ok) {
        this.movimientos = resp.data;        
      }
      // this.cuentas_permisos =resp.cuentas; 
    })
  }

  actualizarMov(data){ 
    this.index = 1;   
    this.CodMovServ.actualizando(data);
  }

  borrarcodMov(mov) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.CodMovServ.borrarTipoMov(mov).subscribe((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

  permisosMovimientos(id: string) {
     this.dialogService.open(MovimientoPermisosComponent, {
      data: {id_tipomov: id},
      header: 'Gestión de permisos a bodegas',
      width: '50%'
    });
  }
}
