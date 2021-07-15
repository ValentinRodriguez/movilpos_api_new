import {Component, OnInit} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { RolesService } from './services/roles.service';
import { UsuarioService } from './services/usuario.service';
import Swal from 'sweetalert2'

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {

    model: any[];
    test: any[] = [];
    modulos: any[] = [];
    usuario: any;
    logo: string;

    constructor(public app: AppMainComponent,
                private usuarioServ:UsuarioService,
                private permisosServ: RolesService) {    
                    this.usuario = this.usuarioServ.getUserLogged();
                    if(this.usuario.empresa != null) {
                        this.logo = this.usuario.empresa.logo;
                    }else{
                        this.logo = null;
                    }
                    
    }

    ngOnInit() {  
        this.permisosServ.permisos.subscribe((resp: any) => { 
          if (resp !== null) {
              this.cargarModulos(resp);
          }else{
            Swal.fire({
                title: 'Atención!',
                text: 'Este usuario no tiene permisos a ninguno de los MODULOS del sistema. Comuniquese con un administrador.',
                icon: 'info',
                confirmButtonText: 'OK'
            })
          }
        })
        this.model = [
            {
                label: 'Favorites', icon: 'pi pi-home',
                items: [
                    {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/']}
                ]
            }            
        ];
    }

    cargarModulos(data) {
        let modulos = JSON.parse(data.modulos);
        let perfiles = JSON.parse(data.perfil);
        let admin = false;
        
        perfiles.forEach(element => {         
            if (element.modulo === 'super administrador' && element.valor === true) {
                admin = true;
                modulos.forEach(element => {
                    this.test.push({label: element.modulo,
                                    icon: element.icon,
                                    items: [{
                                        label: element.modulo,
                                        icon: element.icon,
                                        routerLink: 'menues/'+element.routerLink
                                    }] 
                                })
                }); 
            }
        });
        
        if (admin === false) {
            modulos.forEach(element => {
                if (element.valor === true && admin === false) {
                    console.log(element.valor);                
                    this.test.push({label: element.label,
                                    icon: element.icon,
                                    items: [{label: element.label, icon: element.icon,routerLink: 'menues/'+element.routerLink}] 
                                })                
                }
            });             
        }        
    }

    onMenuClick(event) {      
        this.app.onMenuClick(event);
    }
}
