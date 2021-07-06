import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { HomeService } from 'src/app/services/home.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboarddemo.scss'],
})
export class DashboardDemoComponent implements OnInit {

    cols: any[];
    items: MenuItem[] = [];
    formSubmitted = true;

    constructor(private homeService: HomeService,
                public dialogService: DialogService,
                private permisosServ: RolesService,
                private datosEstaticosServ: DatosEstaticosService) { }

    ngOnInit() {   
        this.permisosServ.permisos.subscribe((resp: any) => {
          const perfiles = JSON.parse(resp.perfil);          
        })
        
        this.homeService.formSubmitted.subscribe((resp: any) => {
            this.formSubmitted = resp;
        })
        
        this.homeService.autoLlenado().then((resp: any) => { 
            for (let index = 0; index < resp.length; index++) {      
                if (resp[index].data.length === 0) {     
                  this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(resp[index].label), routerLink: resp[index].label})
                }      
            }   
        })
    }

    ngOnDestroy() {

    }
}
