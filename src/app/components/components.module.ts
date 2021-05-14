//COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';

// COMPONENTES DE PRIMENG
import { MenubarModule } from 'primeng/menubar';
import { TabViewModule} from 'primeng/tabview';
import { TableModule} from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule} from 'primeng/button';
import { RippleModule} from 'primeng/ripple';
import { PickListModule} from 'primeng/picklist';
import { CardModule} from 'primeng/card';
import { PipesModule } from '../pipes/pipes.module';
import { CheckboxModule} from 'primeng/checkbox';
import { ToastModule} from 'primeng/toast';
import { ToggleButtonModule} from 'primeng/togglebutton';
import { InputSwitchModule} from 'primeng/inputswitch';
import { SelectButtonModule} from 'primeng/selectbutton';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';

// COMPONENTES DEL MODULO DE COMPRAS
import { FooterComponent } from './footer/footer.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SearchpageComponent } from './searchpage/searchpage.component';
import { RightMenuPageComponent } from './right-menu-page/right-menu-page.component';
import { ListaProductosComponent } from './lista-productos/lista-productos.component';
import { ListadoDireccionesComponent } from './listado-direcciones/listado-direcciones.component';
import { PendientesEntradaComponent } from './pendientes-entrada/pendientes-entrada.component';
import { ListadoEmpleadosComponent } from './listado-empleados/listado-empleados.component';
import { FacturasPendientesComponent } from './facturas-pendientes/facturas-pendientes.component';
import { ListadoCatalogoCuentasComponentsComponent } from './listado-catalogo-cuentas-components/listado-catalogo-cuentas-components.component';
import { StepToolbarComponent } from './step-toolbar/step-toolbar.component';
import { PendientesLiquidacionComponent } from './pendientes-liquidacion/pendientes-liquidacion.component';

@NgModule({
  declarations: [
    FooterComponent,
    TopbarComponent,
    SearchpageComponent,
    RightMenuPageComponent,
    ListaProductosComponent,
    ListadoDireccionesComponent,
    PendientesEntradaComponent,
    ListadoEmpleadosComponent,
    FacturasPendientesComponent,
    ListadoCatalogoCuentasComponentsComponent,
    StepToolbarComponent,
    PendientesLiquidacionComponent
  ],
  
  exports: [
    FooterComponent,
    TopbarComponent, 
    SearchpageComponent, 
    RightMenuPageComponent,
    ListaProductosComponent,
    ListadoDireccionesComponent,
    PendientesEntradaComponent,
    StepToolbarComponent
  ],

  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ProgressBarModule,
    RouterModule,
    MenubarModule,
    TableModule,
    TabViewModule,
    InputTextModule,
    ToolbarModule,
    ButtonModule,
    RippleModule,
    PickListModule,
    CardModule,
    CheckboxModule,
    ToastModule,
    ToggleButtonModule,
    InputSwitchModule,
    SelectButtonModule,
    AutoCompleteModule,
    PipesModule
  ],
  entryComponents: [
    ListaProductosComponent,
    ListadoDireccionesComponent,
    PendientesEntradaComponent,
    ListadoEmpleadosComponent
  ]
})
export class ComponentsModule { }
