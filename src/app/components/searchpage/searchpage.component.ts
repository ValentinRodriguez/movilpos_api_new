import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from 'src/app/app.main.component';
import { MenuesService } from 'src/app/services/menues.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-search-page',
    templateUrl: './searchpage.component.html',
    styleUrls: ['./searchpage.component.scss']
})
export class SearchpageComponent implements OnInit {

    menues: any[] = [];
    selectedMenues: any;    
    filteredMenues: any[] = [];

    constructor(public app: AppMainComponent,
                private menuesService: MenuesService,
                private router: Router) {}

    ngOnInit() {
        const menu = JSON.parse(localStorage.getItem('menues'));
        if (menu === null) {
            this.menuesService.getMenues().then((resp: any) => {
                localStorage.setItem('menues',JSON.stringify(resp));
                this.menues = resp;           
            })            
        } else {       
            this.menues = menu;
        }
    }

    filterMenues(event) {
        let filtered : any[] = [];
        let query = event.query;
        for(let i = 0; i < this.menues.length; i++) {
            let country = this.menues[i];
            if (country.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        
        this.filteredMenues = filtered;
    }

    IrPrograma(data) {
        this.app.searchClick = false;
        this.router.navigate([data.url]);      
    }
}
