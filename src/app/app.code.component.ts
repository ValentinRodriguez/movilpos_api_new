import { Component, ElementRef, AfterViewInit, Input, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
    selector: 'app-code',
    template: `
        <pre [ngClass]="'language-' + lang"><code #code><ng-content></ng-content>
</code></pre>
    `,
    styleUrls: ['./app.code.component.scss']
})
export class AppCodeComponent implements AfterViewInit {

    @Input() lang = 'markup';

    @ViewChild('code') codeViewChild: ElementRef;

    constructor(public el: ElementRef) { }

    ngAfterViewInit() {
        if (window['Prism']) {
            window['Prism'].highlightElement(this.codeViewChild.nativeElement);
        }
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [AppCodeComponent],
    declarations: [AppCodeComponent]
})
export class AppCodeModule { }
