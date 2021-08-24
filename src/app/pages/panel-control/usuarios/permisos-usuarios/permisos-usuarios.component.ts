import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModulosService } from 'src/app/services/globales/modulos.service';
import { RolesService } from 'src/app/services/globales/roles.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

@Component({
  selector: 'app-permisos-usuarios',
  templateUrl: './permisos-usuarios.component.html',
  styleUrls: ['./permisos-usuarios.component.scss'],
  providers:[ModulosService,RolesService]
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
              private confirmationService: ConfirmationService,
              private rolesServ: RolesService,
              private uiMessage: UiMessagesService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.user = this.config.data;
    
    this.cols = [
      { field:'codigo', header:'Programa'},
      { field:'todo', header:'Todo'},
      { field:'lectura', header:'Lectura'},
      { field:'escritura', header:'Escritura'},      
      { field:'eliminar', header:'Eliminar'}
    ];
    
    this.todosLosRoles();
  }

  todosLosRoles() {
     
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
        this.modulosServ.autoLlenado().then((resp: any) =>{
              
          resp.forEach(element => {
            switch (element.label) {
              case 'modulos':
                this.modulos = element.data;
                this.todosLosModulos()
                break;

              case 'perfiles':
                this.perfiles = element.data;
                this.todosLosPerfiles();
                break;

              case 'menu':
                // this.programas = element.data;
                this.todosLosProgramas(element.data);
                break;

              default:
                break;
            }
          });      
        })
      }      
    });
  }
  todosLosModulos() {
    this.modulos.forEach(modulo => {
      this.listaModulos.push({'modulo': modulo.modulo, 
                              'valor': false, 
                              'acciones': this.todasLasAccionesModulos(modulo),
                              'icon': modulo.icon,
                              'routerLink': modulo.routerLink
                            });        
    });
    this.listanotificaciones = this.listaModulos
  }

  todosLosPerfiles() {
    this.perfiles.forEach(modulo => {
      this.listaPerfiles.push({'modulo': modulo.descripcion, 'valor':false});        
    });
  }

  todosLosProgramas(data) {               
    data.forEach(programa => {                                 
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
      message:"Esta seguro de quitar todos los permisos?",
      accept:() =>{ 
        this.rolesServ.eliminarRoles(this.user.email).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro restablecido de manera correcta'); 
          this.todosLosPerfiles();
          this.todosLosModulos();
          this.todosLosProgramas(this.programas);
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
