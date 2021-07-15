import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { HomeService } from 'src/app/services/home.service';
import { RolesService } from 'src/app/services/roles.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboarddemo.scss'],
})
export class DashboardDemoComponent implements OnInit {

    cols: any[];
    items: MenuItem[] = [];
    

    constructor(private globalFunction: GlobalFunctionsService,private homeService: HomeService,
                public dialogService: DialogService,
                private permisosServ: RolesService,
                private datosEstaticosServ: DatosEstaticosService) { }

    ngOnInit() {        
        this.permisosServ.permisos.subscribe((resp: any) => {
          const perfiles = JSON.parse(resp.perfil);          
        })
                
        this.homeService.autoLlenado().then((resp: any) => { 
            resp.forEach(element => {
                if (element.data.length === 0) {     
                    console.log(element);                
                    this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(element.label), routerLink: element.label})
                }  
            }); 
        })
        
    }

    ngOnDestroy() {

    }
}
