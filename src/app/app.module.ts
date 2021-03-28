import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';

//MODULOS
import { PipesModule } from "./pipes/pipes.module";
import {AccordionModule} from 'primeng/accordion';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {ChartModule} from 'primeng/chart';
import {CheckboxModule} from 'primeng/checkbox';
import {ChipsModule} from 'primeng/chips';
import {CodeHighlighterModule} from 'primeng/codehighlighter';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {FileUploadModule} from 'primeng/fileupload';
import {FullCalendarModule} from 'primeng/fullcalendar';
import {GalleriaModule} from 'primeng/galleria';
import {InplaceModule} from 'primeng/inplace';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputMaskModule} from 'primeng/inputmask';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
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
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {PaginatorModule} from 'primeng/paginator';
import {PanelModule} from 'primeng/panel';
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
import {StepsModule} from 'primeng/steps';
import {TabMenuModule} from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {BlockUIModule} from 'primeng/blockui';
import {TerminalModule} from 'primeng/terminal';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {ToastModule} from 'primeng/toast';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ToolbarModule} from 'primeng/toolbar';
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
import {CountryService} from './demo/service/countryservice';
import {CustomerService} from './demo/service/customerservice';
import {EventService} from './demo/service/eventservice';
import {IconService} from './demo/service/iconservice';
import {NodeService} from './demo/service/nodeservice';
import {PhotoService} from './demo/service/photoservice';
import {ProductService} from './demo/service/productservice';
import {BreadcrumbService} from './app.breadcrumb.service';
import {MenuService} from './app.menu.service';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

import { OrdenPedidosService } from "./services/orden-pedidos.service";
import { ComponentsModule } from './components/components.module';
import { AppLoginComponent } from './pages/login/app.login.component';
import { AppAccessdeniedComponent } from './pages/access-denied/app.accessdenied.component';
import { AppErrorComponent } from './pages/errores/app.error.component';
import { AppHelpComponent } from './pages/help/app.help.component';
import { AppNotfoundComponent } from './pages/notfound/app.notfound.component';
import { ValidadoresService } from "./services/validadores.service";
import { OrdenesComprasComponent } from './pages/compras/mantenimiento/ordenes-compras/ordenes-compras.component';
import { OrdenescomprasService } from "./services/ordenescompras.service";
import { InterfazVentasComponent } from './pages/ventas/mantenimiento/interfaz-ventas/interfaz-ventas.component';
import { OrdenesPedidosComponent } from './pages/ventas/mantenimiento/ordenes-pedidos/ordenes-pedidos.component';

//PAGINAS
import { DashboardDemoComponent } from './pages/home/dashboarddemo.component';
import { MenuInventarioComponent } from './pages/menues/menu-inventario/menu-inventario.component';
import { MenuVentasComponent } from './pages/menues/menu-ventas/menu-ventas.component';
import { MenuComprasComponent } from './pages/menues/menu-compras/menu-compras.component';
import { MenuContabilidadGeneralComponent } from './pages/menues/menu-contabilidad-general/menu-contabilidad-general.component';
import { MenuEntradasAutomaticasComponent } from './pages/menues/menu-entradas-automaticas/menu-entradas-automaticas.component';
import { MenuTiendaOnlineComponent } from './pages/menues/menu-tienda-online/menu-tienda-online.component';
import { MenuRrhhComponent } from './pages/menues/menu-rrhh/menu-rrhh.component';
import { MaestraProductosComponent } from './pages/inventario/mantenimiento/maestra-productos/maestra-productos.component';
import { BodegasComponent } from './pages/inventario/mantenimiento/bodegas/bodegas.component';
import { CategoriasComponent } from './pages/inventario/mantenimiento/categorias/categorias.component';
import { TiposInventariosComponent } from './pages/inventario/mantenimiento/tipos-inventarios/tipos-inventarios.component';
import { MarcasComponent } from "./pages/inventario/mantenimiento/marcas/marcas.component";
import { TiposMovimientosComponent } from './pages/inventario/mantenimiento/tipos-movimientos/tipos-movimientos.component';
import { TransaccionesInventarioComponent } from './pages/inventario/mantenimiento/transacciones-inventario/transacciones-inventario.component';
import { ClientesComponent } from './pages/ventas/mantenimiento/clientes/clientes.component';
import { ProveedoresComponent } from './pages/compras/mantenimiento/proveedores/proveedores.component';
import { GestionEmpleadosComponent } from './pages/rrhh/mantenimiento/gestion-empleados/gestion-empleados.component';
import { MenuPanelControlComponent } from './pages/menues/menu-panel-control/menu-panel-control.component';
import { UsuariosComponent } from './pages/panel-control/usuarios/usuarios.component';
import { TipoClientesComponent } from './pages/empresa/tipo-clientes/tipo-clientes.component';
import { TipoNegocioComponent } from './pages/empresa/tipo-negocio/tipo-negocio.component';
import { MenuEmpresaComponent } from './pages/menues/menu-empresa/menu-empresa.component';
import { EmpresaComponent } from './pages/empresa/empresa/empresa.component';
import { PermisosUsuariosComponent } from './pages/panel-control/usuarios/permisos-usuarios/permisos-usuarios.component';
import { AusenciasComponent } from './pages/rrhh/mantenimiento/gestion-empleados/ausencias/ausencias.component';
import { AmonestacionesComponent } from './pages/rrhh/mantenimiento/gestion-empleados/amonestaciones/amonestaciones.component';
import { HorasExtrasComponent } from './pages/rrhh/mantenimiento/gestion-empleados/horas-extras/horas-extras.component';
import { DescuentosComponent } from './pages/rrhh/mantenimiento/gestion-empleados/descuentos/descuentos.component';
import { VacacionesComponent } from './pages/rrhh/mantenimiento/gestion-empleados/vacaciones/vacaciones.component';
import { RequisicionesComponent } from './pages/compras/mantenimiento/requisiciones/requisiciones.component';
import { StepComponent } from './pages/inventario/mantenimiento/maestra-productos/step/step.component';
import { FormularioMarcaComponent } from './pages/inventario/mantenimiento/marcas/formulario-marca/formulario-marca.component';
import { FormularioBodegasComponent } from './pages/inventario/mantenimiento/bodegas/formulario-bodegas/formulario-bodegas.component';
import { FormularioTipoinvComponent } from './pages/inventario/mantenimiento/tipos-inventarios/formulario-tipoinv/formulario-tipoinv.component';
import { FormularioCatComponent } from './pages/inventario/mantenimiento/categorias/formulario-cat/formulario-cat.component';
import { BodegasPermisosComponent } from './pages/inventario/mantenimiento/bodegas/bodegas-permisos/bodegas-permisos.component';
import { MovimientoPermisosComponent } from './pages/inventario/mantenimiento/tipos-movimientos/movimiento-permisos/movimiento-permisos.component';
import { StepTransaccionesComponent } from "./pages/inventario/mantenimiento/transacciones-inventario/step-transacciones/step-transacciones.component";
import { FormularioClientesComponent } from './pages/ventas/mantenimiento/clientes/formulario-clientes/formulario-clientes.component';
import { StepclientesComponent } from './pages/ventas/mantenimiento/clientes/stepclientes/stepclientes.component';
import { FormularioTiponegocioComponent } from './pages/empresa/tipo-negocio/formulario-tiponegocio/formulario-tiponegocio.component';
import { FormularioTipoClientesComponent } from './pages/empresa/tipo-clientes/formulario-tipo-clientes/formulario-tipo-clientes.component';
import { CondicionesPagoComponent } from './pages/ventas/mantenimiento/condiciones-pago/condiciones-pago.component';
import { FormularioCondicionesComponent } from './pages/ventas/mantenimiento/condiciones-pago/formulario-condiciones/formulario-condiciones.component';
import { CondicionesPagoService } from "./services/condiciones-pago.service";
import { FormularioEmpleadosComponent } from './pages/rrhh/mantenimiento/gestion-empleados/formulario-empleados/formulario-empleados.component';
import { StepEmpleadosComponent } from './pages/rrhh/mantenimiento/gestion-empleados/step-empleados/step-empleados.component';
import { DepartamentosComponent } from './pages/rrhh/mantenimiento/departamentos/departamentos.component';
import { FormularioDepartamentosComponent } from './pages/rrhh/mantenimiento/departamentos/formulario-departamentos/formulario-departamentos.component';
import { MonedasComponent } from './pages/empresa/monedas/monedas.component';
import { FormularioMonedasComponent } from './pages/empresa/monedas/formulario-monedas/formulario-monedas.component';

import { MonedasService } from "./services/monedas.service";
import { FormularioEmpresaComponent } from './pages/empresa/empresa/formulario-empresa/formulario-empresa.component';
import { FormularioProveedoresComponent } from './pages/compras/mantenimiento/proveedores/formulario-proveedores/formulario-proveedores.component';
import { StepProveedoresComponent } from './pages/compras/mantenimiento/proveedores/step-proveedores/step-proveedores.component';
import { TransportistasComponent } from './pages/inventario/mantenimiento/transportistas/transportistas.component';
import { FormularioTransportistaComponent } from './pages/inventario/mantenimiento/transportistas/formulario-transportista/formulario-transportista.component';
import { FormularioCgcatalogoComponent } from './pages/contabilidad-general/mantenimiento/catalogo-cuentas/formulario-cgcatalogo/formulario-cgcatalogo.component';
import { CatalogoCuentasComponent } from './pages/contabilidad-general/mantenimiento/catalogo-cuentas/catalogo-cuentas.component';
import { StepOrdenesComprasComponent } from './pages/compras/mantenimiento/ordenes-compras/step-ordenes-compras/step-ordenes-compras.component';
import { TiposProveedoresComponent } from './pages/compras/mantenimiento/proveedores/tipos-proveedores/tipos-proveedores.component';
import { FormularioTipoProveedoresComponent } from './pages/compras/mantenimiento/proveedores/tipos-proveedores/formulario-tipo-proveedores/formulario-tipo-proveedores.component';
import { FormularioUsuariosComponent } from './pages/panel-control/usuarios/formulario-usuarios/formulario-usuarios.component';
import { FormularioMaestraProductosComponent } from './pages/inventario/mantenimiento/maestra-productos/formulario-maestra-productos/formulario-maestra-productos.component';
import { StepHomeComponent } from './pages/home/step-home/step-home.component';
import { PropiedadesComponent } from './pages/inventario/mantenimiento/propiedades/propiedades.component';
import { FormularioPropiedadesComponent } from './pages/inventario/mantenimiento/propiedades/formulario-propiedades/formulario-propiedades.component';
import { PeriodosFiscalesComponent } from './pages/contabilidad-general/mantenimiento/periodos-fiscales/periodos-fiscales.component';
import { FormularioPeriodoFiscalesComponent } from './pages/contabilidad-general/mantenimiento/periodos-fiscales/formulario-periodo-fiscales/formulario-periodo-fiscales.component';
import { ActPeriodosComponent } from './pages/contabilidad-general/mantenimiento/periodos-fiscales/act-periodos/act-periodos.component';
import { MenuMiscelaneosComponent } from './pages/menues/menu-miscelaneos/menu-miscelaneos.component';
import { GestionActividadesComponent } from './pages/miscelaneos/gestion-actividades/gestion-actividades.component';
import { ActividadesService } from "./services/actividades.service";
import { TipoDocumentosComponent } from './pages/empresa/tipo-documentos/tipo-documentos.component';
import { FormularioTipoDocumentosComponent } from './pages/empresa/tipo-documentos/formulario-tipo-documentos/formulario-tipo-documentos.component';
import { FormularioTipoMovComponent } from './pages/inventario/mantenimiento/tipos-movimientos/formulario-tipo-mov/formulario-tipo-mov.component';
import { StepTipoMovComponent } from './pages/inventario/mantenimiento/tipos-movimientos/step-tipo-mov/step-tipo-mov.component';
import { FormularioInvTransaccionesComponent } from './pages/inventario/mantenimiento/transacciones-inventario/formulario-inv-transacciones/formulario-inv-transacciones.component';
import { StepTransportistasComponent } from './pages/inventario/mantenimiento/transportistas/step-transportistas/step-transportistas.component';
import { PuestosComponent } from './pages/rrhh/mantenimiento/puestos/puestos.component';
import { FormularioPuestosComponent } from './pages/rrhh/mantenimiento/puestos/formulario-puestos/formulario-puestos.component';
import { CotizacionesComponent } from './pages/ventas/mantenimiento/cotizaciones/cotizaciones.component';
import { FormularioCotizacionesComponent } from './pages/ventas/mantenimiento/cotizaciones/formulario-cotizaciones/formulario-cotizaciones.component';
import { FormularioOrdenesPedidosComponent } from './pages/ventas/mantenimiento/ordenes-pedidos/formulario-ordenes-pedidos/formulario-ordenes-pedidos.component';
import { StepOrdenesPedidosComponent } from './pages/ventas/mantenimiento/ordenes-pedidos/step-ordenes-pedidos/step-ordenes-pedidos.component';
import { PuertosComponent } from "./pages/compras/mantenimiento/puertos/puertos.component";
import { FormularioPuertosComponent } from "./pages/compras/mantenimiento/puertos/formulario-puertos/formulario-puertos.component";
import { DireccionesEnvioComponent } from './pages/compras/mantenimiento/direcciones-envio/direcciones-envio.component';
import { FormularioDireccionesComponent } from './pages/compras/mantenimiento/direcciones-envio/formulario-direcciones/formulario-direcciones.component';

// SERVICIOS
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModulosService } from "./services/modulos.service";
import { MenuesService } from "./services/menues.service";
import { SettingsService } from "./services/settings.service";
import { InventarioService } from "./services/inventario.service";
import { BodegasService } from "./services/bodegas.service";
import { PaisesCiudadesService } from "./services/paises-ciudades.service";
import { UiMessagesService } from "./services/ui-messages.service";
import { CategoriasService } from "./services/categorias.service";
import { TipoInventarioService } from "./services/tipo-inventario.service";
import { CgcatalogoService } from "./services/cgcatalogo.service";
import { BrandsService } from "./services/brands.service";
import { CodMovService } from "./services/cod-mov.service";
import { DatosEstaticosService } from "./services/datos-estaticos.service";
import { TransaccionesService } from "./services/transacciones.service";
import { FacturasService } from "./services/facturas.service";
import { DepartamentosService } from "./services/departamentos.service";
import { ProveedoresService } from "./services/proveedores.service";
import { TransportistasService } from "./services/transportistas.service";
import { RrhhService } from "./services/rrhh.service";
import { ClientesService } from "./services/clientes.service";
import { EmpresaService } from "./services/empresa.service";
import { PuestosService } from "./services/puestos.service";
import { RolesService } from "./services/roles.service";
import { RequisicionesService } from "./services/requisiciones.service";
import { ZonasService } from "./services/zonas.service";
import { TipoProveedorService } from "./services/tipo-proveedor.service";
import { HomeService } from "./services/home.service";
import { PropiedadesService } from "./services/propiedades.service";
import { PeriodosFiscalesService } from "./services/periodos-fiscales.service";
import { TipoClienteService } from "./services/tipo-cliente.service";
import { TipoNegocioService } from "./services/tipo-negocio.service";
import { PuertosService } from "./services/puertos.service";
import { DireccionesService } from "./services/direcciones.service";
import { MenuCuentasPagarComponent } from './pages/menues/menu-cuentas-pagar/menu-cuentas-pagar.component';
import { ErrorInterceptorService } from "./services/interceptors/error-interceptor.service";
import { HttpHeadersService } from "./services/interceptors/http-headers.service"; 
import { TiendaService } from "./services/tienda.service";
import { EntradaDiarioComponent } from './pages/contabilidad-general/mantenimiento/entrada-diario/entrada-diario.component';
import { FormularioEntradaDiarioComponent } from './pages/contabilidad-general/mantenimiento/entrada-diario/formulario-entrada-diario/formulario-entrada-diario.component';
import { CoTransaccionescxpService } from './services/co-transaccionescxp.service';
import { EntradasDiarioService } from './services/entradas-diario.service';
import { AnalisisSaldoComponent } from './pages/cuentas-pagar/reportes/analisis-saldo/analisis-saldo.component';
import { TransaccionesPagoComponent } from './pages/contabilidad-general/mantenimiento/transacciones-pago/transacciones-pago.component';
import { FormularioTransaccionesPagoComponent } from './pages/contabilidad-general/mantenimiento/transacciones-pago/formulario-transacciones-pago/formulario-transacciones-pago.component';
import { StepTransaccionesPagoComponent } from './pages/contabilidad-general/mantenimiento/transacciones-pago/step-transacciones-pago/step-transacciones-pago.component';
import { TransacionPagosService } from "./services/transacion-pagos.service";
import { FacturasProveedoresComponent } from './pages/compras/mantenimiento/facturas-proveedores/facturas-proveedores.component';
import { FormularioFacturaProvedoresComponent } from './pages/compras/mantenimiento/facturas-proveedores/formulario-factura-provedores/formulario-factura-provedores.component';
import { StepFacturaProvedoresComponent } from './pages/compras/mantenimiento/facturas-proveedores/step-factura-provedores/step-factura-provedores.component';

import { SecuenciasService } from "./services/secuencias.service";
import { DgiiService } from "./services/dgii.service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
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
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
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
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        AppCodeModule,
        ComponentsModule,
        DynamicDialogModule,
        KeyFilterModule,
        BlockUIModule,
        PipesModule
        
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

        // PAGINAS
        DashboardDemoComponent,
        MenuInventarioComponent,
        MenuVentasComponent,
        MenuComprasComponent,
        MenuContabilidadGeneralComponent,
        MenuEntradasAutomaticasComponent,
        MenuTiendaOnlineComponent,
        MenuRrhhComponent,
        MaestraProductosComponent,
        BodegasComponent,
        CategoriasComponent,
        TiposInventariosComponent,
        MarcasComponent,
        TiposMovimientosComponent,
        TransaccionesInventarioComponent,
        ClientesComponent,
        ProveedoresComponent,
        OrdenesComprasComponent,
        InterfazVentasComponent,
        OrdenesPedidosComponent,
        GestionEmpleadosComponent,
        MenuPanelControlComponent,
        UsuariosComponent,
        TipoClientesComponent,
        TipoNegocioComponent,
        MenuEmpresaComponent,
        EmpresaComponent,
        PermisosUsuariosComponent,
        AusenciasComponent,
        AmonestacionesComponent,
        HorasExtrasComponent,
        DescuentosComponent,
        VacacionesComponent,
        RequisicionesComponent,
        StepComponent,
        FormularioMarcaComponent,
        FormularioBodegasComponent,
        FormularioTipoinvComponent,
        FormularioCatComponent,
        BodegasPermisosComponent,
        MovimientoPermisosComponent,
        StepTransaccionesComponent,
        FormularioClientesComponent,
        StepclientesComponent,
        FormularioTiponegocioComponent,
        FormularioTipoClientesComponent,
        CondicionesPagoComponent,
        FormularioCondicionesComponent,
        FormularioEmpleadosComponent,
        StepEmpleadosComponent,
        DepartamentosComponent,
        FormularioDepartamentosComponent,
        MonedasComponent,
        FormularioMonedasComponent,
        FormularioEmpresaComponent,
        FormularioProveedoresComponent,
        StepProveedoresComponent,
        TransportistasComponent,
        FormularioTransportistaComponent,
        CatalogoCuentasComponent,
        FormularioCgcatalogoComponent,
        StepOrdenesComprasComponent,
        PuertosComponent,
        FormularioPuertosComponent,
        TiposProveedoresComponent,
        FormularioTipoProveedoresComponent,
        FormularioUsuariosComponent,
        FormularioMaestraProductosComponent,
        StepHomeComponent,
        PropiedadesComponent,
        FormularioPropiedadesComponent,
        PeriodosFiscalesComponent,
        FormularioPeriodoFiscalesComponent,
        ActPeriodosComponent,
        MenuMiscelaneosComponent,
        GestionActividadesComponent,
        TipoDocumentosComponent,
        FormularioTipoDocumentosComponent,
        FormularioTipoMovComponent,
        StepTipoMovComponent,
        FormularioInvTransaccionesComponent,
        StepTransportistasComponent,
        PuestosComponent,
        FormularioPuestosComponent,
        CotizacionesComponent,
        FormularioCotizacionesComponent,
        FormularioOrdenesPedidosComponent,
        StepOrdenesPedidosComponent,
        DireccionesEnvioComponent,
        FormularioDireccionesComponent,
        MenuCuentasPagarComponent,
        EntradaDiarioComponent,
        FormularioEntradaDiarioComponent,
        AnalisisSaldoComponent,
        TransaccionesPagoComponent,
        FormularioTransaccionesPagoComponent,
        StepTransaccionesPagoComponent,
        FacturasProveedoresComponent,
        FormularioFacturaProvedoresComponent,
        StepFacturaProvedoresComponent
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
        CountryService, 
        CustomerService, 
        EventService, 
        IconService, 
        NodeService,
        ProgressSpinnerModule,
        PhotoService, 
        ProductService, 
        MenuService, 
        BreadcrumbService, 
        ModulosService,
        MenuesService,
        SettingsService,
        InventarioService,
        BodegasService,
        PaisesCiudadesService,
        UiMessagesService,
        ConfirmationService,
        MessageService,
        CategoriasService,
        TipoInventarioService,
        CgcatalogoService,
        BrandsService,
        CodMovService,
        DatosEstaticosService,
        DialogService,
        TransaccionesService,
        FacturasService,
        DepartamentosService,
        ProveedoresService,
        TransportistasService,
        RrhhService,
        ClientesService,
        OrdenescomprasService,
        EmpresaService,
        OrdenescomprasService,
        OrdenPedidosService,
        PuestosService,
        RolesService,
        RequisicionesService,
        CondicionesPagoService,
        MonedasService,
        ZonasService,
        TipoProveedorService,
        HomeService,
        PropiedadesService,
        PeriodosFiscalesService,
        ActividadesService,
        TipoClienteService,
        TipoNegocioService,
        PuertosService,
        DireccionesService,
        TiendaService,
        CoTransaccionescxpService,
        ValidadoresService,
        TransacionPagosService,
        SecuenciasService,
        DgiiService,
        EntradasDiarioService
    ],
    entryComponents:[
        PermisosUsuariosComponent,
        AusenciasComponent,
        AmonestacionesComponent,
        HorasExtrasComponent,
        DescuentosComponent,
        VacacionesComponent,
        StepComponent,
        StepTransaccionesComponent,
        StepclientesComponent,
        StepEmpleadosComponent,
        StepProveedoresComponent,
        BodegasPermisosComponent,
        MovimientoPermisosComponent,
        FormularioTransportistaComponent,
        FormularioCondicionesComponent,
        FormularioClientesComponent,
        FormularioEmpresaComponent,
        FormularioCgcatalogoComponent,
        FormularioProveedoresComponent,
        StepOrdenesComprasComponent,
        ActPeriodosComponent,
        StepHomeComponent

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
