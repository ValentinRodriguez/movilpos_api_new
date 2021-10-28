import {Component, Input, OnInit} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { UsuarioService } from './services/panel-control/usuario.service';
import Swal from 'sweetalert2'
import { ModulosService } from './services/globales/modulos.service';
import { MenuesService } from './services/globales/menues.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {

    model: any[];
    test: any[] = [];
    modulos: any[] = [];
    empresa: any;
    logo: string;
    @Input() roles: any;

    constructor(public app: AppMainComponent,
                private modulosSrv: ModulosService,
                private menuesSrv: MenuesService) {                     
    }

    ngOnInit() {  
        this.modulosSrv.getModulos().subscribe((resp: any) =>{
            if (resp.ok) {
                this.cargarModulos(resp.modulos.data);                
                localStorage.setItem('modulos', JSON.stringify(resp.modulos.data));
            }            
        })

        this.menuesSrv.getMenues().subscribe((resp: any) =>{
            console.log(resp);
            
            if (resp.ok) {                                
                localStorage.setItem('modulos', JSON.stringify(resp.menues.data));
            }            
        })
    }

    cargarModulos(mods) {
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

    onMenuClick(event) {      
        this.app.onMenuClick(event);
    }
}
