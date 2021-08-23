import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';

//MODULOS DE PRIMENG
import {AccordionModule} from 'primeng/accordion';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {ChartModule} from 'primeng/chart';
import {CheckboxModule} from 'primeng/checkbox';
import {ChipsModule} from 'primeng/chips';
import {CodeHighlighterModule} from 'primeng/codehighlighter';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {FieldsetModule} from 'primeng/fieldset';
import {FullCalendarModule} from 'primeng/fullcalendar';
import {GalleriaModule} from 'primeng/galleria';
import {InplaceModule} from 'primeng/inplace';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {LightboxModule} from 'primeng/lightbox';
import {ListboxModule} from 'primeng/listbox';
import {MegaMenuModule} from 'primeng/megamenu';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MultiSelectModule} from 'primeng/multiselect';
import {OrderListModule} from 'primeng/orderlist';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {PaginatorModule} from 'primeng/paginator';
import {PanelMenuModule} from 'primeng/panelmenu';
import {PasswordModule} from 'primeng/password';
import {PickListModule} from 'primeng/picklist';
import {ProgressBarModule} from 'primeng/progressbar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RatingModule} from 'primeng/rating';
import {RippleModule} from 'primeng/ripple';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SidebarModule} from 'primeng/sidebar';
import {SlideMenuModule} from 'primeng/slidemenu';
import {SliderModule} from 'primeng/slider';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TabMenuModule} from 'primeng/tabmenu';
import {BlockUIModule} from 'primeng/blockui';
import {TerminalModule} from 'primeng/terminal';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {TooltipModule} from 'primeng/tooltip';
import {TreeModule} from 'primeng/tree';
import {TreeTableModule} from 'primeng/treetable';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {AppCodeModule} from './app.code.component';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import {AppConfigComponent} from './app.config.component';
import {AppMenuComponent} from './app.menu.component';
import {AppMenuitemComponent} from './app.menuitem.component';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {KeyFilterModule} from 'primeng/keyfilter';
import {BreadcrumbService} from './app.breadcrumb.service';
import {MenuService} from './app.menu.service';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';

//COMPONENTES DEL PROYECTO
import { AppLoginComponent } from './pages/login/app.login.component';
import { AppAccessdeniedComponent } from './pages/access-denied/app.accessdenied.component';
import { AppErrorComponent } from './pages/errores/app.error.component';
import { AppHelpComponent } from './pages/help/app.help.component';
import { AppNotfoundComponent } from './pages/notfound/app.notfound.component';

// SERVICIOS
import { HttpHeadersService } from "./services/interceptors/http-headers.service";
import { ErrorInterceptorService } from "./services/interceptors/error-interceptor.service";

// MODULOS
import { PipesModule } from "./pipes/pipes.module";
import { ComponentsModule } from './components/components.module';
import { ComprasModule } from "./pages/compras/compras.module";
import { ContabilidadGeneralModule } from "./pages/contabilidad-general/contabilidad-general.module";
import { CuentasPagarModule } from "./pages/cuentas-pagar/cuentas-pagar.module";
import { EmpresaModule } from "./pages/empresa/empresa.module";  
import { InventarioModule } from "./pages/inventario/inventario.module";
import { MenuesModule } from "./pages/menues/menues.module";
import { MiscelaneosModule } from "./pages/miscelaneos/miscelaneos.module";
import { PanelControlModule } from "./pages/panel-control/panel-control.module";
import { RrhhModule } from "./pages/rrhh/rrhh.module";
import { VentasModule } from "./pages/ventas/ventas.module";
import { ServicesModule } from "./services/services.module";
import { HomeModule } from "./pages/home/home.module";
import { StepsModule } from 'primeng/steps';
import { TiendaModule } from "./pages/tienda/tienda.module";
import { ImagenRotaDirective } from './directives/imagen.directive';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ComprasModule,
        ComponentsModule,
        ContabilidadGeneralModule,
        CuentasPagarModule,
        EmpresaModule,
        InventarioModule,
        MenuesModule,
        MiscelaneosModule,
        PanelControlModule,
        RrhhModule,
        VentasModule,
        ServicesModule,
        HomeModule,
        TiendaModule,
        
        AccordionModule,
        BreadcrumbModule,
        ButtonModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        FieldsetModule,
        FullCalendarModule,
        GalleriaModule,
        InplaceModule,
        InputNumberModule,
        InputSwitchModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        PaginatorModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        SelectButtonModule,
        SidebarModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        TabMenuModule,
        TerminalModule,
        TieredMenuModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        AppCodeModule,
        DynamicDialogModule,
        KeyFilterModule,
        BlockUIModule,
        PipesModule,
        ProgressSpinnerModule,
        StepsModule,
        ToolbarModule      
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppConfigComponent,
        AppLoginComponent,
        AppAccessdeniedComponent,
        AppErrorComponent,
        AppHelpComponent,
        AppNotfoundComponent,
        ImagenRotaDirective
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {   provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptorService,
            multi: true,
        },
        {   provide: HTTP_INTERCEPTORS,
            useClass: HttpHeadersService,
            multi: true,
        },
        AppMainComponent,  
        MenuService, 
        BreadcrumbService, 
        ConfirmationService,
        MessageService,
        DialogService,
    ],
    bootstrap: [AppComponent],
    entryComponents: [ ]
})
export class AppModule {
}
