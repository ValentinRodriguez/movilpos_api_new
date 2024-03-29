import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/app.breadcrumb.service';
import { AppMainComponent } from 'src/app/app.main.component';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { FacturasService } from 'src/app/services/ventas/facturas.service';


@Component({
  selector: 'app-topbar-page',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnDestroy, OnInit {

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
    img: any;
    @Input() simbolo: string
    stateOptions2: { label: string; value: string; icon: string; justify: string; }[];
    listSubscribers: any = [];

    constructor(public breadcrumbService: BreadcrumbService,
                public app: AppMainComponent,
                public usuarioServ: UsuarioService,
                public facturaServ: FacturasService,                
                public datosEstaticos: DatosEstaticosService) {

        this.usuario = this.usuarioServ.getUserLogged().usuario;
        
        if (this.usuario !== null) {
            this.img = this.usuario.img                
            this.nombre = this.usuario.nombre;
        }    
    }
    
    ngOnDestroy(): void {
        this.listSubscribers.forEach(a => a.unsubscribe());
    }

    ngOnInit(): void {  
        // this.listObserver(); 

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

    listObserver = () => {
        const observer1$ = []
        this.listSubscribers = [observer1$];
    };

    modoPago(tipo) {
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
        
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
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
