import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { DashboardDemoComponent } from './pages/home/dashboarddemo.component';

// PAGINAS
import { AppLoginComponent } from "./pages/login/app.login.component";
import { AppAccessdeniedComponent } from "./pages/access-denied/app.accessdenied.component";
import { AppHelpComponent } from "./pages/help/app.help.component";
import { AppNotfoundComponent } from "./pages/notfound/app.notfound.component";
import { AppErrorComponent } from "./pages/errores/app.error.component";

// MENUES
import { MenuInventarioComponent } from './pages/menues/menu-inventario/menu-inventario.component';
import { MenuVentasComponent } from './pages/menues/menu-ventas/menu-ventas.component';
import { MenuComprasComponent } from "./pages/menues/menu-compras/menu-compras.component";
import { MenuContabilidadGeneralComponent } from "./pages/menues/menu-contabilidad-general/menu-contabilidad-general.component";
import { MenuEntradasAutomaticasComponent } from "./pages/menues/menu-entradas-automaticas/menu-entradas-automaticas.component";
import { MenuTiendaOnlineComponent } from "./pages/menues/menu-tienda-online/menu-tienda-online.component";
import { MenuRrhhComponent } from './pages/menues/menu-rrhh/menu-rrhh.component';
import { MenuPanelControlComponent } from './pages/menues/menu-panel-control/menu-panel-control.component';
import { MenuMiscelaneosComponent } from './pages/menues/menu-miscelaneos/menu-miscelaneos.component';

import { MenuEmpresaComponent } from './pages/menues/menu-empresa/menu-empresa.component';

// INVENTARIO
import { MaestraProductosComponent } from "./pages/inventario/mantenimiento/maestra-productos/maestra-productos.component";
import { BodegasComponent } from "./pages/inventario/mantenimiento/bodegas/bodegas.component";
import { CategoriasComponent } from "./pages/inventario/mantenimiento/categorias/categorias.component";
import { TiposInventariosComponent } from "./pages/inventario/mantenimiento/tipos-inventarios/tipos-inventarios.component";
import { MarcasComponent } from "./pages/inventario/mantenimiento/marcas/marcas.component";
import { TiposMovimientosComponent } from "./pages/inventario/mantenimiento/tipos-movimientos/tipos-movimientos.component";
import { TransaccionesInventarioComponent } from './pages/inventario/mantenimiento/transacciones-inventario/transacciones-inventario.component';
import { TransportistasComponent } from './pages/inventario/mantenimiento/transportistas/transportistas.component';

// VENTAS
import { ClientesComponent } from './pages/ventas/mantenimiento/clientes/clientes.component';
import { InterfazVentasComponent } from './pages/ventas/mantenimiento/interfaz-ventas/interfaz-ventas.component';
import { OrdenesPedidosComponent } from './pages/ventas/mantenimiento/ordenes-pedidos/ordenes-pedidos.component';
import { TipoClientesComponent } from './pages/empresa/tipo-clientes/tipo-clientes.component';
import { CondicionesPagoComponent } from './pages/ventas/mantenimiento/condiciones-pago/condiciones-pago.component';

// COMPRAS
import { ProveedoresComponent } from './pages/compras/mantenimiento/proveedores/proveedores.component';
import { OrdenesComprasComponent } from './pages/compras/mantenimiento/ordenes-compras/ordenes-compras.component';
import { RequisicionesComponent } from './pages/compras/mantenimiento/requisiciones/requisiciones.component';

//RRHH
import { GestionEmpleadosComponent } from './pages/rrhh/mantenimiento/gestion-empleados/gestion-empleados.component';
import { DepartamentosComponent } from './pages/rrhh/mantenimiento/departamentos/departamentos.component';

// CATALOGO CUENTAS
import { CatalogoCuentasComponent } from "./pages/contabilidad-general/mantenimiento/catalogo-cuentas/catalogo-cuentas.component";

//PANEL CONTROL
import { UsuariosComponent } from './pages/panel-control/usuarios/usuarios.component';

import { TipoNegocioComponent } from './pages/empresa/tipo-negocio/tipo-negocio.component';
import { EmpresaComponent } from './pages/empresa/empresa/empresa.component';
import { MonedasComponent } from './pages/empresa/monedas/monedas.component';

//GUARDS
import { LoginGuard } from "./services/guards/login.guard";
import { PropiedadesComponent } from './pages/inventario/mantenimiento/propiedades/propiedades.component';
import { PeriodosFiscalesComponent } from './pages/contabilidad-general/mantenimiento/periodos-fiscales/periodos-fiscales.component';
import { GestionActividadesComponent } from './pages/miscelaneos/gestion-actividades/gestion-actividades.component';
import { PuestosComponent } from './pages/rrhh/mantenimiento/puestos/puestos.component';
import { PuertosComponent } from './pages/compras/mantenimiento/puertos/puertos.component';
import { DireccionesEnvioComponent } from './pages/compras/mantenimiento/direcciones-envio/direcciones-envio.component';
import { MenuCuentasPagarComponent } from './pages/menues/menu-cuentas-pagar/menu-cuentas-pagar.component';
import { CuentasPagarComponent } from './pages/cuentas-pagar/mantenimiento/cuentas-pagar/cuentas-pagar.component';
import { TransaccionescxpComponent } from './pages/compras/mantenimiento/transaccionescxp/transaccionescxp.component';
import { EntradaDiarioComponent } from './pages/contabilidad-general/mantenimiento/entrada-diario/entrada-diario.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                canActivate: [LoginGuard],
                children: [
                    {path: '', component: DashboardDemoComponent},
                    {path: 'pages/help', component: AppHelpComponent},

                    //MENUES
                    {path: 'menu-inventario', component: MenuInventarioComponent},
                    {path: 'menu-ventas', component: MenuVentasComponent},
                    {path: 'menu-compras', component: MenuComprasComponent},
                    {path: 'menu-contabilidad-general', component: MenuContabilidadGeneralComponent},
                    {path: 'menu-entradas-automaticas', component: MenuEntradasAutomaticasComponent},
                    {path: 'menu-tienda-online', component: MenuTiendaOnlineComponent},
                    {path: 'menu-panel-control', component: MenuPanelControlComponent},
                    {path: 'menu-empresa', component: MenuEmpresaComponent},
                    {path: 'menu-recursos-humanos', component: MenuRrhhComponent},
                    {path: 'menu-miscelaneos', component: MenuMiscelaneosComponent},
                    {path: 'menu-cuentas-pagar', component: MenuCuentasPagarComponent},

                    // INVENTARIO
                    {path: 'gestion-de-productos', component: MaestraProductosComponent},
                    {path: 'gestion-de-bodegas', component: BodegasComponent},     
                    {path: 'gestion-de-modelos', component: CategoriasComponent},                 
                    {path: 'gestion-tipos-inventarios', component: TiposInventariosComponent}, 
                    {path: 'gestion-de-marcas', component: MarcasComponent},
                    {path: 'gestion-tipos-movimientos', component: TiposMovimientosComponent},  
                    {path: 'gestion-transacciones-inventario', component: TransaccionesInventarioComponent},
                    {path: 'gestion-de-transportistas', component: TransportistasComponent},
                    {path: 'gestion-de-propiedades', component: PropiedadesComponent},

                    // VENTAS
                    {path: 'gestion-de-clientes', component: ClientesComponent},
                    {path: 'gestion-de-ordenes-de-pedidos', component: OrdenesPedidosComponent},
                    {path: 'condiciones-de-pago', component: CondicionesPagoComponent},
                                        
                    // COMPRAS
                    {path: 'gestion-de-proveedores', component: ProveedoresComponent},
                    {path: 'gestion-de-ordenes-compras', component: OrdenesComprasComponent},
                    {path: 'gestion-de-requisiciones', component: RequisicionesComponent},
                    {path: 'gestion-de-puertos', component: PuertosComponent},
                    {path: 'gestion-direcciones-envio', component: DireccionesEnvioComponent},
                    {path: 'gestion-transacciones-cpx', component: TransaccionescxpComponent},

                    //RRHH
                    {path: 'gestion-de-empleados', component: GestionEmpleadosComponent},
                    {path: 'gestion-de-departamentos', component: DepartamentosComponent},
                    {path: 'gestion-de-puestos', component: PuestosComponent},

                    //PANEL DE CONTROL
                    
                    //MI EMPRESA
                    {path: 'gestion-de-empresa', component: EmpresaComponent},
                    {path: 'gestion-de-tipo-negocios', component: TipoNegocioComponent},
                    {path: 'gestion-de-tipo-clientes', component: TipoClientesComponent},
                    {path: 'gestion-de-usuarios', component: UsuariosComponent},
                    {path: 'gestion-de-monedas', component: MonedasComponent},
                    
                    // CONTABILIDAD GENERAL
                    {path: 'gestion-catalogo-cuentas', component: CatalogoCuentasComponent},
                    {path: 'gestion-periodos-fiscales', component: PeriodosFiscalesComponent},
                    {path: 'gestion-entradas-diario', component: EntradaDiarioComponent},

                    // CUENTAS POR PAGAR
                    {path: 'gestion-de-factura-proveedores', component: CuentasPagarComponent},

                    // MISCELANEOS
                    {path: 'gestion-de-actividades', component: GestionActividadesComponent}                    
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
