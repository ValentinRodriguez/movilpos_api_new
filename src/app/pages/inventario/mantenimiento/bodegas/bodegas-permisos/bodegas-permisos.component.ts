import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BodegasService } from 'src/app/services/bodegas.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-bodegas-permisos',
  templateUrl: './bodegas-permisos.component.html',
  styleUrls: ['./bodegas-permisos.component.scss']
})
export class BodegasPermisosComponent implements OnInit {
  usuario: any;
  usuarios: any[] = [];
  usuariosPermisos: any[] = [];
  id_bodega: any;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              private bodegasServ: BodegasService) { 
                this.usuario = this.usuariosServ.getUserLogged()
              }

  ngOnInit(): void {
    this.id_bodega = this.config.data.bodega;
    
    this.usuariosServ.getUsers().then((resp:any)=>{
      this.usuarios = resp;      
      this.permisosBodega(this.usuario.id)
    })    
  }

  guardarPermisos() {
    if (this.usuariosPermisos.length === 0) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Error','Debe agregar al menos una bodega.');   
      return;
    }
    
    let param = {
      id_bodega : this.id_bodega,
      usuario_permisos: JSON.stringify(this.usuariosPermisos),
      usuario_creador: this.usuario.username,
      email: this.usuario.email,
      estado: 'activo'
    }
      
    this.bodegasServ.permisosBodega(param).then((resp: any) => {
      this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);      
    })
  }

  permisosBodega(id) {
    this.bodegasServ.usuariosPermisosBodegas(id).then((resp: any)=>{
      this.usuariosPermisos = resp;              
      this.usuariosPermisos.forEach(element => {        
        this.usuarios = this.usuarios.filter( (data: any) => {   
          return data.email !== element.email;
        });
      });
    })    
  }

}
