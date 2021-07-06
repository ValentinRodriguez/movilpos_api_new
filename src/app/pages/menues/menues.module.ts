import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';

import { MenuInventarioComponent } from './menu-inventario/menu-inventario.component';
import { MenuVentasComponent } from './menu-ventas/menu-ventas.component';
import { MenuComprasComponent } from './menu-compras/menu-compras.component';
import { MenuContabilidadGeneralComponent } from './menu-contabilidad-general/menu-contabilidad-general.component';
import { MenuEntradasAutomaticasComponent } from './menu-entradas-automaticas/menu-entradas-automaticas.component';
import { MenuTiendaOnlineComponent } from './menu-tienda-online/menu-tienda-online.component';
import { MenuRrhhComponent } from './menu-rrhh/menu-rrhh.component';
import { MenuPanelControlComponent } from './menu-panel-control/menu-panel-control.component';
import { MenuEmpresaComponent } from './menu-empresa/menu-empresa.component';
import { MenuCuentasPagarComponent } from './menu-cuentas-pagar/menu-cuentas-pagar.component';
import { MenuMiscelaneosComponent } from './menu-miscelaneos/menu-miscelaneos.component';
import { ProgressBarModule } from 'primeng/progressbar';
// RUTAS DEL MODULO
import { MenuRoutingModule } from "./menu-routing.module";

@NgModule({
  declarations: [
    MenuComprasComponent,
    MenuContabilidadGeneralComponent,
    MenuCuentasPagarComponent,
    MenuEmpresaComponent,
    MenuEntradasAutomaticasComponent,
    MenuInventarioComponent,
    MenuMiscelaneosComponent,
    MenuPanelControlComponent,
    MenuRrhhComponent,
    MenuTiendaOnlineComponent,
    MenuVentasComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    ProgressBarModule,
    MenuRoutingModule
  ]
})
export class MenuesModule { }
