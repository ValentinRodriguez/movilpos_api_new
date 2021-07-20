import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ListadoEmpleadosComponent } from 'src/app/components/listado-empleados/listado-empleados.component';
import { RrhhService } from 'src/app/services/rrhh/rrhh.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';
import { PermisosUsuariosComponent } from './permisos-usuarios/permisos-usuarios.component';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuarios = []; 
  usuario: any; 
  actualizando = false;
  actualizar = false;
  id_categoria: any;
  cols: any[]; 
  message: string;
  fileUser: any;
  index: number = 0;
  empleados: any[] = [];
   

  constructor(private confirmationService: ConfirmationService,
              private empleadoServ: RrhhService,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.obtenerUsuarios();
              }

  ngOnInit(): void {

    this.empleadoServ.getDatos().then((resp: any) =>{
      this.empleados = resp;
    });

    this.usuariosServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.usuariosServ.usuarioActualizado.subscribe(() => {
      this.obtenerUsuarios();
    })

    this.usuariosServ.usuarioGuardado.subscribe(() => {
      this.obtenerUsuarios();
    })

    this.usuariosServ.usuarioBorrado.subscribe(() => {
      this.obtenerUsuarios();
    })

    this.cols = [
      { field: 'primernombre', header: 'Nombre' },
      { field: 'username', header: 'Usuario' },
      { field: 'email', header: 'Email' },
      { field: 'puesto', header: 'Puesto' },
      { field: 'estado', header: 'Estado' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }
  
  obtenerUsuarios() {
         
    this.usuariosServ.getUsers().then((resp: any) => {
      this.usuarios = resp;
       
    })
  }

  actualizarUsuario(data) {
    this.index = 1;   
    this.usuariosServ.actualizando(data);
  }

  borrarUsuario(usuario) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.usuariosServ.eliminarUsuario(usuario).then(()=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

  desbloquear(email) {
    this.usuariosServ.unLockLogin(email).then(() =>{
      this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Usuario Desbloqueado'); 
      this.obtenerUsuarios();
    })
  }

  desactivar(email) {
    this.usuariosServ.desactivar(email).then(() =>{
      this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Usuario Desactivado'); 
      this.obtenerUsuarios();
    })
  }

  listadoEmpleados(data) {
    if (this.empleados.length !== 0) {
      setTimeout(() => {
        if (data === 1) {
           this.dialogService.open(ListadoEmpleadosComponent, {
            header: 'Listado de empleados',
            width: '50%'
          });      
        }
      }, 300);      
    }
  }

  permisosUsuarios() {
     this.dialogService.open(PermisosUsuariosComponent, {
      data: this.usuario,
      header: 'Permisos a usuarios',
      width: '70%'
    });
  }
}
