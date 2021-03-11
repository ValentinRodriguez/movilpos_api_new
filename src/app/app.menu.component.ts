import {Component, OnInit} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { ModulosService } from './services/modulos.service';
import { UsuarioService } from './services/usuario.service';

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
                private modulosServ: ModulosService,
                private usuarioServ:UsuarioService) {    
                    this.usuario = this.usuarioServ.getUserLogged();
                    if(this.usuario.empresa.length != 0) {
                        this.logo = this.usuario.empresa.logo;
                    }else{
                        this.logo = null;
                    }
                    this.modulosServ.getModulos().then((resp: any) => {
                        this.modulos = resp;
                        resp.forEach(element => {
                            this.test.push({label: element.label,
                                            icon: element.icon,
                                            items: [{
                                                label: element.label,
                                                icon: element.icon,
                                                routerLink: element.routerLink
                                            }] 
                                        })
                        });     
                    })
    }

    ngOnInit() {       
        this.model = [
            {
                label: 'Favorites', icon: 'pi pi-home',
                items: [
                    {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/']}
                ]
            }
            
        ];
    }

    onMenuClick(event) {
        this.app.onMenuClick(event);
    }
}
