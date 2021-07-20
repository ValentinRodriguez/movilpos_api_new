import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActividadesService } from "./miscelaneos/actividades.service";
import { AreasEmpresaService } from "./rrhh/areas-empresa.service";
import { BodegasService } from "./inventario/bodegas.service";
import { BrandsService } from "./inventario/brands.service";
import { CategoriasService } from "./inventario/categorias.service";
import { CgcatalogoService } from "./contabilidad/cgcatalogo.service";
import { ClientesService } from "./ventas/clientes.service";
import { CoTransaccionescxpService } from './cuentas-pagar/co-transaccionescxp.service';
import { CodMovService } from "./inventario/cod-mov.service";
import { CondicionesPagoService } from "./ventas/condiciones-pago.service";
import { CuadresService } from "./contabilidad/cuadres.service";
import { DatosEstaticosService } from "./globales/datos-estaticos.service";
import { DepartamentosService } from "./rrhh/departamentos.service";
import { DgiiService } from "./globales/dgii.service";
import { DireccionesService } from "./compras/direcciones.service";
import { EmpresaService } from "./mi-empresa/empresa.service";
import { EntradasDiarioService } from './contabilidad/entradas-diario.service';
import { ExistenciaAlmacenesService } from "./existencia-almacenes.service";
import { FacturasService } from "./ventas/facturas.service";
import { GlobalFunctionsService } from "./globales/global-functions.service";
import { HomeService } from "./globales/home.service";
import { InventarioService } from "./inventario/inventario.service";
import { LiquidacionMercanciasService } from "./inventario/liquidacion-mercancias.service";
import { MenuesService } from "./globales/menues.service";
import { MonedasService } from "./mi-empresa/monedas.service";
import { ModulosService } from "./globales/modulos.service";
import { OrdenPedidosService } from "./ventas/orden-pedidos.service";
import { OrdenescomprasService } from "./compras/ordenescompras.service";
import { PaisesCiudadesService } from "./globales/paises-ciudades.service";
import { PeriodosFiscalesService } from "./contabilidad/periodos-fiscales.service";
import { PropiedadesService } from "./inventario/propiedades.service";
import { ProveedoresService } from "./compras/proveedores.service";
import { PuertosService } from "./compras/puertos.service";
import { PuestosService } from "./rrhh/puestos.service";
import { RecepcionVehiculosService } from "./ventas/recepcion-vehiculos.service";
import { RequisicionesService } from "./compras/requisiciones.service";
import { RolesService } from "./globales/roles.service";
import { RrhhService } from "./rrhh/rrhh.service";
import { SecuenciasService } from "./globales/secuencias.service";
import { SettingsService } from "./globales/settings.service";
import { SucursalesService } from "./mi-empresa/sucursales.service";
import { TiendaService } from "./tienda/tienda.service";
import { TipoClienteService } from "./mi-empresa/tipo-cliente.service";
import { TipoInventarioService } from "./inventario/tipo-inventario.service";
import { TipoNegocioService } from "./mi-empresa/tipo-negocio.service";
import { TipoProveedorService } from "./mi-empresa/tipo-proveedor.service";
import { TransaccionesService } from "./inventario/transacciones.service";
import { TransacionPagosService } from "./contabilidad/transacion-pagos.service";
import { TransportistasService } from "./inventario/transportistas.service";
import { UiMessagesService } from "./globales/ui-messages.service";
import { ValidadoresService } from "./globales/validadores.service";
import { ZonasService } from "./mi-empresa/zonas.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ModulosService,
    CuadresService,
    MenuesService,
    SettingsService,
    InventarioService,
    BodegasService,
    PaisesCiudadesService,
    UiMessagesService,
    CategoriasService,
    TipoInventarioService,
    SucursalesService,
    CgcatalogoService,
    BrandsService,
    AreasEmpresaService,
    CodMovService,
    DatosEstaticosService,
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
    GlobalFunctionsService,
    EntradasDiarioService,
    ExistenciaAlmacenesService,
    LiquidacionMercanciasService,
    RecepcionVehiculosService
  ]
})
export class ServicesModule { }
