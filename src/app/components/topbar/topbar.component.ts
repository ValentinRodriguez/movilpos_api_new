import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AppMainComponent } from 'src/app/app.main.component';
import { BreadcrumbService } from 'src/app/app.breadcrumb.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { MenuesService } from 'src/app/services/menues.service';
import { FacturasService } from 'src/app/services/facturas.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';

@Component({
  selector: 'app-topbar-page',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnDestroy, OnInit {
    subscription: Subscription;
    @Input() menu: string;
    items: MenuItem[];
    usuario: any;
    nombre: any;
    tieredItems: MenuItem[] = [];
    modulos: any;
    menues: any;
    checked1: boolean = false;
    stateOptions: any[];
    value1: string = "pos";
    foto: any;
    constructor(public breadcrumbService: BreadcrumbService, 
                public app: AppMainComponent,
                public usuarioServ: UsuarioService,
                public facturaServ: FacturasService,
                private modulosServ: ModulosService,
                private menuServ: MenuesService,
                public datosEstaticos: DatosEstaticosService) {

        this.usuario = this.usuarioServ.getUserLogged() || null;
        if (this.usuario !== null) {
            this.foto = this.usuario.foto                
            this.nombre = this.usuario.name+' '+this.usuario.surname;
        }
        this.stateOptions = [{label: 'POS', value: 'pos'}, {label: 'Orden', value: 'orden'}];

        this.modulosServ.getModulos().then((resp: any) => {

            this.modulos = resp;
            let i = 0;

            this.menuServ.getMenues().then((resp2: any)=>{
                this.menues = resp2;   
                resp.forEach(element => {
                    this.tieredItems.push(
                        {
                            label: this.datosEstaticos.capitalizeFirstLetter(element.modulo),
                            icon: element.icon,
                            items:[]
                        }
                    )
                    this.menues.forEach(element2 => {
                        if (element2.modulo === element.id) {
                            this.tieredItems[i]['items'].push({
                                label: this.capitalizeFirstLetter(element2.nombre),
                                icon: element2.icon,
                                url: '#/'+element2.url
                            })
                        }
                    });
                    i++;
                });                  
            })
        })
    }

    ngOnInit(): void {        

    }

    onMenuButtonClick(data) {
        console.log(data)
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    logout() {
        this.usuarioServ.logout(this.usuario.email)
    }

    desplegar() {
        this.facturaServ.display = true     
    }
   
    ocultar() {
        this.facturaServ.display = false    
    }

    modoVenta(modo){
        this.facturaServ.modoDeVenta(modo.value)
    }
}
