import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import { RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';
 
import { FooterComponent } from './footer/footer.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SearchpageComponent } from './searchpage/searchpage.component';
import { RightMenuPageComponent } from './right-menu-page/right-menu-page.component';
import { MenubarModule } from 'primeng/menubar';
import { CatalogoCuentasComponent } from './catalogo-cuentas/catalogo-cuentas.component';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {PickListModule} from 'primeng/picklist';
// import { MovimientoPermisosComponent } from './movimiento-permisos/movimiento-permisos.component';
import { ListaProductosComponent } from './lista-productos/lista-productos.component';
import {CardModule} from 'primeng/card';
import { ListadoDireccionesComponent } from './listado-direcciones/listado-direcciones.component';
import { PipesModule } from '../pipes/pipes.module';
import { PendientesEntradaComponent } from './pendientes-entrada/pendientes-entrada.component';
import {CheckboxModule} from 'primeng/checkbox';
import {ToastModule} from 'primeng/toast';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {InputSwitchModule} from 'primeng/inputswitch';
import {SelectButtonModule} from 'primeng/selectbutton';
import { ListadoEmpleadosComponent } from './listado-empleados/listado-empleados.component';

@NgModule({
  declarations: [
    FooterComponent,
    TopbarComponent,
    SearchpageComponent,
    RightMenuPageComponent,
    CatalogoCuentasComponent,
    ListaProductosComponent,
    ListadoDireccionesComponent,
    PendientesEntradaComponent,
    ListadoEmpleadosComponent
  ],
  
  exports: [
    FooterComponent,
    TopbarComponent, 
    SearchpageComponent, 
    RightMenuPageComponent,
    CatalogoCuentasComponent,
    ListaProductosComponent,
    ListadoDireccionesComponent,
    PendientesEntradaComponent
  ],

  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
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
    PipesModule
  ],
  entryComponents: [
    CatalogoCuentasComponent,
    ListaProductosComponent,
    ListadoDireccionesComponent,
    PendientesEntradaComponent,
    ListadoEmpleadosComponent
  ]
})
export class ComponentsModule { }
