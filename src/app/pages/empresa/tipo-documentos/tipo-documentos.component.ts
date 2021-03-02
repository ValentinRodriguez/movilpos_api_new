import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ListadoEmpleadosComponent } from 'src/app/components/listado-empleados/listado-empleados.component';
import { RrhhService } from 'src/app/services/rrhh.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PermisosUsuariosComponent } from '../../panel-control/usuarios/permisos-usuarios/permisos-usuarios.component';

@Component({
  selector: 'app-tipo-documentos',
  templateUrl: './tipo-documentos.component.html',
  styleUrls: ['./tipo-documentos.component.scss']
})
export class TipoDocumentosComponent implements OnInit {

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

    this.usuariosServ.usuarioActualizado.subscribe(resp => {
      this.obtenerUsuarios();
    })

    this.usuariosServ.usuarioGuardado.subscribe(resp => {
      this.obtenerUsuarios();
    })

    this.usuariosServ.usuarioBorrado.subscribe(resp => {
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
        this.usuariosServ.eliminarUsuario(usuario).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Usuario eliminado de manera correcta');   
        })       
      }
    })
  }

  listadoEmpleados(data) {
    if (this.empleados.length !== 0) {
      setTimeout(() => {
        if (data === 1) {
          const ref = this.dialogService.open(ListadoEmpleadosComponent, {
            header: 'Listado de empleados',
            width: '50%'
          });      
        }
      }, 300);      
    }
  }

  permisosUsuarios() {
    const ref = this.dialogService.open(PermisosUsuariosComponent, {
      data: this.usuario,
      header: 'Permisos a usuarios',
      width: '70%'
    });
  }

}
