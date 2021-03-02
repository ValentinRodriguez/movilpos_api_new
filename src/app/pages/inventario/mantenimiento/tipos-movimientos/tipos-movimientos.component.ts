import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MovimientoPermisosComponent } from 'src/app/pages/inventario/mantenimiento/tipos-movimientos/movimiento-permisos/movimiento-permisos.component';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { CodMovService } from 'src/app/services/cod-mov.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-tipos-movimientos',
  templateUrl: './tipos-movimientos.component.html',
  styleUrls: ['./tipos-movimientos.component.scss']
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
  loading: boolean;
  catalogos = false;
  movimientoExiste = 3;
  id_mov: any;
  mov_nombre: any
  index: number = 0;

  cols:any = [];
  cols2: { field: string; header: string; }[];

  constructor(private uiMessage: UiMessagesService,              
              public dialogService: DialogService,             
              private confirmationService: ConfirmationService,
              private CodMovServ: CodMovService,
              ) { }

  ngOnInit(): void {
    this.todosLosMov();      
    this.movBorrado();
    this.movGuardado();
        
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

    this.CodMovServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })
  }

  todosLosMov() {
    this.movimientos = [];    
    this.loading = true;
    this.CodMovServ.getDatos().then((resp: any) => {   
      console.log(resp);
      this.movimientos = resp.codigosmov;
      console.log(this.movimientos)
      this.cuentas_permisos =resp.cuentas; 
      this.loading = false;
    })
  }

  movBorrado() {
    this.CodMovServ.tipoMovBorrado.subscribe((resp: any)=>{      
      this.todosLosMov();
    })
  }

  movGuardado() {
    this.CodMovServ.tipoMovGuardado.subscribe((resp: any)=>{
      this.todosLosMov();
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
        this.CodMovServ.borrarTipoMov(mov).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }

  permisosMovimientos(id: string) {
    const ref = this.dialogService.open(MovimientoPermisosComponent, {
      data: {
        id_tipomov: id
      },
      header: 'Gestión de permisos a bodegas',
      width: '50%'
    });
  }

}
