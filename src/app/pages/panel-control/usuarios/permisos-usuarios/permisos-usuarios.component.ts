import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuesService } from 'src/app/services/menues.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { RolesService } from 'src/app/services/roles.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-permisos-usuarios',
  templateUrl: './permisos-usuarios.component.html',
  styleUrls: ['./permisos-usuarios.component.scss']
})
export class PermisosUsuariosComponent implements OnInit {
  
  listaPerfiles: any[] = [];
  perfiles: any[] = [];
  listaModulos: any[] = [];
  listanotificaciones: any[] = [];
  modulos: any[] = [];
  programas: any[] = [];
  accionesMod: any[] = [];
  guardando = false;
  cols: any[];

  restableciendo = false;
  restablecer = true;  
  user: any;
  constructor(private modulosServ: ModulosService,
              private menuesServ: MenuesService,
              private confirmationService: ConfirmationService,
              private usuariosServ: UsuarioService,
              private rolesServ: RolesService,
              private uiMessage: UiMessagesService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.user = this.config.data;
    this.rolesServ.getRolFull(this.user.email, this.user.username).then((resp: any) => {      
      if (resp.length !== 0) {
        this.modulosServ.getModulos().then((resp2: any) =>{
          this.modulos = resp2  
          this.listaPerfiles = JSON.parse(resp[0].perfil);
          this.listaModulos = JSON.parse(resp[0].modulos);          
          this.programas = JSON.parse(resp[0].programas);
          this.listanotificaciones = JSON.parse(resp[0].notificaciones);
        })
      }else{
        this.todosLosPerfiles();
        this.todosLosModulos();
        this.todosLosProgramas();
      }      
    })

    this.cols = [
      { field:'codigo', header:'Programa'},
      { field:'todo', header:'Todo'},
      { field:'lectura', header:'Lectura'},
      { field:'escritura', header:'Escritura'},      
      { field:'eliminar', header:'Eliminar'}
    ] 
  }

  todosLosModulos() {
    this.modulosServ.getModulos().then((resp: any) => {
      this.modulos = resp;
      this.modulos.forEach(modulo => {
        this.listaModulos.push({'modulo': modulo.modulo, 'valor': false, acciones: this.todasLasAccionesModulos(modulo)});        
      });
      this.listanotificaciones = this.listaModulos
    })
  }

  todosLosPerfiles() {
    this.usuariosServ.getPerfiles().then((resp: any) =>{
      console.log(resp);
      this.perfiles = resp;                  
      this.perfiles.forEach(modulo => {
        this.listaPerfiles.push({'modulo': modulo.descripcion, 'valor':false});        
      });  
    })
  }

  todosLosProgramas() {
    this.menuesServ.getMenues().then((resp: any) => {   
      let programas = []

      programas.push(...resp);                
      programas.forEach(programa => {                                 
        this.programas.push({'codigo': programa.codigo, 
                             'estado': programa.estado,
                             'id': programa.id,
                             'id_menu': programa.id_menu,
                             'modulo': programa.modulo,
                             'nombre':  programa.nombre,
                             'status': programa.status,
                             'url': programa.url,
                             'todo': false,
                             'lectura': false,
                             'escritura': false,
                             'eliminar': false});        
      });
    }) 
  }

  todasLasAccionesModulos(modulo) {   
    let accionesMod = []
    accionesMod.push({'accion':'TODO','codigo': modulo.id+'-t', 'valor': false})
    accionesMod.push({'accion':'LECTURA','codigo': modulo.id+'-l', 'valor': false})
    accionesMod.push({'accion':'ESCRITURA','codigo': modulo.id+'-e', 'valor': false})
    accionesMod.push({'accion':'ELIMINAR','codigo': modulo.id+'-b', 'valor': false})
    return accionesMod;
  }

  saveForm() {
    let obj:any = {};
    obj.perfil = this.listaPerfiles;
    obj.modulos = this.listaModulos;
    obj.programas = this.programas;
    obj.notificaciones = this.listanotificaciones;
    this.rolesServ.guardarRoles(obj, this.user.email, this.user.username).then(resp =>{
      this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Permisos concedidos de manera correcta');
    })
  }

  restablecerPermisos() {
    this.confirmationService.confirm({
      message:"Esta de quitar todos los permisos?",
      accept:() =>{ 
        this.rolesServ.eliminarRoles(this.user.email).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj); 
          this.todosLosPerfiles();
          this.todosLosModulos();
          this.todosLosProgramas();
        })       
      }
    })

  }
  todaAccionMod(event,z) {
    if (event.checked) {
      const acciones = this.listaModulos[z].acciones
      acciones.forEach(element => {
        element.valor = true;
      });      
    }else{
      const acciones = this.listaModulos[z].acciones
      acciones.forEach(element => {
        element.valor = false;
      });  
    }   
  }

  todaAccionProg(event,i) {
    if (event.checked) {
      this.programas[i].todo = true;
      this.programas[i].lectura = true;
      this.programas[i].escritura = true;
      this.programas[i].eliminar = true;
    } else {
      this.programas[i].todo = false;
      this.programas[i].lectura = false;
      this.programas[i].escritura = false;
      this.programas[i].eliminar = false;
    }
  }
}
