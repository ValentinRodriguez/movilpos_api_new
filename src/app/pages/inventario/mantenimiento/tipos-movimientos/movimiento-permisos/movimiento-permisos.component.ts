import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CodMovService } from 'src/app/services/inventario/cod-mov.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';


@Component({
  selector: 'app-movimiento-permisos',
  templateUrl: './movimiento-permisos.component.html',
  styleUrls: ['./movimiento-permisos.component.scss'],
  providers:[CodMovService,UsuarioService]
})
export class MovimientoPermisosComponent implements OnInit {
  usuariosmov: any[] = [];  
  usuariosPermisosmov: any[] = [];
  id_mov: any;
  usuario: any;

  constructor(private CodMovServ: CodMovService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,) { 
                
              }

  ngOnInit(): void {
    this.id_mov = this.config.data.id_tipomov;
    
    this.usuariosServ.getUsers().then((resp:any)=>{
      this.usuariosmov = resp;      
      this.permisosMovimientos(this.id_mov)
    })  
  }

  guardarPermisos() {
    if (this.usuariosPermisosmov.length === 0) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Error','Debe agregar al menos una bodega.');   
      return;
    }
    
    let param = {
      id_tipomov : this.id_mov,
      usuario_permisos: JSON.stringify(this.usuariosPermisosmov),
      email: this.usuario.email,
      estado: 'activo'
    }
      
    this.CodMovServ.permisosMovimientos(param).then((resp: any) => {
      this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');      
    })
  }

  permisosMovimientos(id) {   
    this.CodMovServ.usuariosPermisosMov(id).then((resp: any)=>{
      this.usuariosPermisosmov = resp;
              
      this.usuariosPermisosmov.forEach(element => {        
        this.usuariosmov = this.usuariosmov.filter( (data: any) => {   
          return data.email !== element.email;
        });
      });
    }) 
  }
}
