import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppMainComponent} from './app.main.component';

// PAGINAS
import { AppLoginComponent } from "./pages/login/app.login.component";
import { AppAccessdeniedComponent } from "./pages/access-denied/app.accessdenied.component";
import { AppNotfoundComponent } from "./pages/notfound/app.notfound.component";
import { AppErrorComponent } from "./pages/errores/app.error.component";

// VENTAS
import { InterfazVentasComponent } from './pages/ventas/mantenimiento/interfaz-ventas/interfaz-ventas.component';

//GUARDS
import { LoginGuard } from "./services/guards/login.guard";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                canActivate: [LoginGuard],
                children: [
                    // {path: 'pages/help', component: AppHelpComponent},
                    // {path: '', component: DashboardDemoComponent},

                    {path: 'dashboard', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },

                    //MENUES
                    {path: 'menues', loadChildren: () => import('./pages/menues/menues.module').then(m => m.MenuesModule) },
                    
                    //PANEL DE CONTROL
                    {path: 'panel-control', loadChildren: () => import('./pages/panel-control/panel-control.module').then(m => m.PanelControlModule) },
                    
                    // COMPRAS
                    {path: 'compras', loadChildren: () => import('./pages/compras/compras.module').then(m => m.ComprasModule) },

                    // CONTABILIDAD GENERAL
                    {path: 'contabilidad-general', loadChildren: () => import('./pages/contabilidad-general/contabilidad-general.module').then(m => m.ContabilidadGeneralModule) },

                     // CUENTAS POR PAGAR
                     {path: 'cuentas-pagar', loadChildren: () => import('./pages/cuentas-pagar/cuentas-pagar.module').then(m => m.CuentasPagarModule) },

                     //MI EMPRESA
                     {path: 'mi-negocio', loadChildren: () => import('./pages/empresa/empresa.module').then(m => m.EmpresaModule) },

                    // INVENTARIO
                    {path: 'inventario', loadChildren: () => import('./pages/inventario/inventario.module').then(m => m.InventarioModule) },

                    // MISCELANEOS  
                    {path: 'miscelaneos', loadChildren: () => import('./pages/miscelaneos/miscelaneos.module').then(m => m.MiscelaneosModule) },
 
                    //RRHH
                    {path: 'rrhh', loadChildren: () => import('./pages/rrhh/rrhh.module').then(m => m.RrhhModule) },

                    // VENTAS
                    {path: 'ventas', loadChildren: () => import('./pages/ventas/ventas.module').then(m => m.VentasModule) },
                ]
            },
            {path: 'interfaz-ventas', component: InterfazVentasComponent},
            {path: 'error', component: AppErrorComponent},
            {path: 'access', component: AppAccessdeniedComponent},
            {path: 'notfound', component: AppNotfoundComponent},
            {path: 'login', component: AppLoginComponent},
            {path: '**', redirectTo: '/notfound'},
        ], { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
