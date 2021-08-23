import {Component, Input, OnInit} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { UsuarioService } from './services/panel-control/usuario.service';
import Swal from 'sweetalert2'

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
    @Input() roles: any;

    constructor(public app: AppMainComponent,
                private usuarioServ:UsuarioService) {    
                    this.usuario = this.usuarioServ.getUserLogged();
                    if(this.usuario.empresa != null) {
                        this.logo = this.usuario.empresa.logo;
                    }else{
                        this.logo = null;
                    }                    
    }

    ngOnInit() {  
        let mods = JSON.parse(localStorage.getItem('modulos'));
        let perfs = JSON.parse(localStorage.getItem('perfiles'));
        
        if (mods === null || perfs === null) {                    
            if (this.roles !== null) {              
              localStorage.setItem('perfiles',this.roles.perfil);
                localStorage.setItem('modulos', this.roles.modulos);
                this.cargarModulos(JSON.parse(this.roles.modulos),JSON.parse(this.roles.perfil));
            }else{
              Swal.fire({
                  title: 'Atención!',
                  text: 'Este usuario no tiene permisos a ninguno de los MODULOS del sistema. Comuniquese con un administrador.',
                  icon: 'info',
                  confirmButtonText: 'OK'
              })
            }          
        } else {
            this.cargarModulos(mods, perfs);
        }
    }

    cargarModulos(mods, perfs) {
        let admin = false;
        
        perfs.forEach(element => {         
            if (element.modulo === 'super administrador' && element.valor === true) {
                admin = true;
                mods.forEach(element => {
                    this.test.push({label: element.modulo,icon: element.icon,
                                    items: [{
                                        label: element.modulo,
                                        icon: element.icon,
                                        routerLink: 'menues/'+element.routerLink
                                    }] 
                    })
                }); 
            }
        });       
    }

    onMenuClick(event) {      
        this.app.onMenuClick(event);
    }
}
