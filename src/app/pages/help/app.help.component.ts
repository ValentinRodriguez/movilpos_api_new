import { Component } from '@angular/core';
import {BreadcrumbService} from '../../app.breadcrumb.service';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
    templateUrl: './app.help.component.html',
})
export class AppHelpComponent {
    text: any;

    filteredText: any[];

    constructor(private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            {label: 'Help'}
        ]);
    }

    filterText(event) {
        const query = event.query;
        this.filteredText = [];

        for (let i = 0; i < 10; i++) {
            this.filteredText.push(query + i);
        }
    }

}
