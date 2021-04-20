import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { MenuPanelControlComponent } from './menu-panel-control/menu-panel-control.component';
import { MenuInventarioComponent } from './menu-inventario/menu-inventario.component';
import { MenuVentasComponent } from './menu-ventas/menu-ventas.component';
import { MenuComprasComponent } from "./menu-compras/menu-compras.component";
import { MenuContabilidadGeneralComponent } from "./menu-contabilidad-general/menu-contabilidad-general.component";
import { MenuEntradasAutomaticasComponent } from "./menu-entradas-automaticas/menu-entradas-automaticas.component";
import { MenuTiendaOnlineComponent } from "./menu-tienda-online/menu-tienda-online.component";
import { MenuRrhhComponent } from './menu-rrhh/menu-rrhh.component';
import { MenuMiscelaneosComponent } from './menu-miscelaneos/menu-miscelaneos.component';
import { MenuEmpresaComponent } from './menu-empresa/menu-empresa.component';
import { MenuCuentasPagarComponent } from './menu-cuentas-pagar/menu-cuentas-pagar.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
         {path: 'menu-panel-control', component: MenuPanelControlComponent},
         {path: 'menu-panel-control', component: MenuPanelControlComponent},
         {path: 'menu-inventario', component: MenuInventarioComponent},
         {path: 'menu-ventas', component: MenuVentasComponent},
         {path: 'menu-compras', component: MenuComprasComponent},
         {path: 'menu-contabilidad-general', component: MenuContabilidadGeneralComponent},
         {path: 'menu-entradas-automaticas', component: MenuEntradasAutomaticasComponent},
         {path: 'menu-tienda-online', component: MenuTiendaOnlineComponent},
         {path: 'menu-empresa', component: MenuEmpresaComponent},
         {path: 'menu-recursos-humanos', component: MenuRrhhComponent},
         {path: 'menu-miscelaneos', component: MenuMiscelaneosComponent},
         {path: 'menu-cuentas-pagar', component: MenuCuentasPagarComponent},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
