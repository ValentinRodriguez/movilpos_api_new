import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AppMainComponent } from 'src/app/app.main.component';
import { BreadcrumbService } from 'src/app/app.breadcrumb.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { MenuesService } from 'src/app/services/menues.service';
import { FacturasService } from 'src/app/services/facturas.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { Router } from '@angular/router';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
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
    value2: string = "efectivo";
    foto: any;
    @Input() simbolo: string
    stateOptions2: { label: string; value: string; icon: string; justify: string; }[];
    
    constructor(public breadcrumbService: BreadcrumbService,
                public app: AppMainComponent,
                public usuarioServ: UsuarioService,
                public facturaServ: FacturasService,
                private modulosServ: ModulosService,
                public datosEstaticos: DatosEstaticosService) {

        this.usuario = this.usuarioServ.getUserLogged() || null;
        if (this.usuario !== null) {
            this.foto = this.usuario.foto                
            this.nombre = this.usuario.name+' '+this.usuario.surname;
        }     

    }
    
    ngOnInit(): void {          
        this.stateOptions = [{label: 'POS', value: 'pos', icon: 'fas fa-store', justify: 'Left'}, 
                             { label: 'Orden', value: 'orden', icon: 'fas fa-file-alt', justify: 'Left' },
                             { label: 'Codigo', value: 'codigo', icon: 'fas fa-barcode', justify: 'Left' }
        ];

        this.stateOptions2 = [{label: 'Efectivo', value: 'efectivo', icon: 'fas fa-money-bill-wave', justify: 'Left'}, 
                              { label: 'Tarjeta', value: 'tarjeta', icon: 'far fa-credit-card', justify: 'Left' },
                              { label: 'Cheque', value: 'cheque', icon: 'fas fa-money-check', justify: 'Left' },
                              { label: 'Efectivo y Tarjeta', value: 'ambos', icon: 'fas fa-wallet', justify: 'Left' }
        ];
    }

    modoPago(tipo) {
        console.log(tipo);
        
        const obj:any = {};
        switch (tipo.value) {
            case 'efectivo':
                obj.efectivo = true;
                obj.tarjeta = false;
                obj.cheque = false;
                obj.ambos = false;
            break;
  
            case 'tarjeta':
                obj.efectivo = false;
                obj.tarjeta = true;
                obj.cheque = false;
                obj.ambos = false;
            break;
  
            case 'cheque':
                obj.efectivo = false;
                obj.tarjeta = false;
                obj.cheque = true;
                obj.ambos = false;              
            break;
  
            case 'ambos':
                obj.efectivo = false;
                obj.tarjeta = false;
                obj.cheque = false;
                obj.ambos = true;  
            default:
            
            break;
        }
        this.facturaServ.metodoPago(obj);
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
        this.facturaServ.displayDetalle();
    }
   
    ocultar() {
        this.facturaServ.displayDetalle();   
    }

    modoVenta(modo){
        this.facturaServ.modoDeVenta(modo.value)
    }
}
