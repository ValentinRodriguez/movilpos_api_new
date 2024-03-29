import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { HomeService } from 'src/app/services/globales/home.service';
import { RolesService } from 'src/app/services/globales/roles.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboarddemo.scss'],
})
export class DashboardDemoComponent implements OnInit {

    cols: any[];
    items: MenuItem[] = [];
    

    constructor(private homeService: HomeService,
                public dialogService: DialogService,
                private permisosServ: RolesService,
                private datosEstaticosServ: DatosEstaticosService) { }

    ngOnInit() {        
        // this.permisosServ.permisos.subscribe((resp: any) => {
        //     const perfiles = JSON.parse(resp.perfil);          
        // })
                
        // this.homeService.autoLlenado().then((resp: any) => { 
        //     resp.forEach(element => {
        //         if (element.data.length === 0) {     
        //                             
        //             this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(element.label), routerLink: element.label})
        //         }  
        //     }); 
        // })
        
    }

    ngOnDestroy() {

    }
}
