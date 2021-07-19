import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActividadesService } from "./actividades.service";
import { AreasEmpresaService } from "./areas-empresa.service";
import { BodegasService } from "./bodegas.service";
import { BrandsService } from "./brands.service";
import { CategoriasService } from "./categorias.service";
import { CgcatalogoService } from "./cgcatalogo.service";
import { ClientesService } from "./clientes.service";
import { CoTransaccionescxpService } from './co-transaccionescxp.service';
import { CodMovService } from "./cod-mov.service";
import { CondicionesPagoService } from "./condiciones-pago.service";
import { CuadresService } from "./cuadres.service";
import { DatosEstaticosService } from "./datos-estaticos.service";
import { DepartamentosService } from "./departamentos.service";
import { DgiiService } from "./dgii.service";
import { DireccionesService } from "./direcciones.service";
import { EmpresaService } from "./mi-empresa/empresa.service";
import { EntradasDiarioService } from './entradas-diario.service';
import { ExistenciaAlmacenesService } from "./existencia-almacenes.service";
import { FacturasService } from "./facturas.service";
import { GlobalFunctionsService } from "./global-functions.service";
import { HomeService } from "./home.service";
import { InventarioService } from "./inventario.service";
import { LiquidacionMercanciasService } from "./liquidacion-mercancias.service";
import { MenuesService } from "./menues.service";
import { MonedasService } from "./mi-empresa/monedas.service";
import { ModulosService } from "./modulos.service";
import { OrdenPedidosService } from "./orden-pedidos.service";
import { OrdenescomprasService } from "./ordenescompras.service";
import { PaisesCiudadesService } from "./paises-ciudades.service";
import { PanelControlService } from "./panel-control.service";
import { PeriodosFiscalesService } from "./periodos-fiscales.service";
import { PropiedadesService } from "./propiedades.service";
import { ProveedoresService } from "./proveedores.service";
import { PuertosService } from "./puertos.service";
import { PuestosService } from "./puestos.service";
import { RecepcionVehiculosService } from "./recepcion-vehiculos.service";
import { RequisicionesService } from "./requisiciones.service";
import { RolesService } from "./roles.service";
import { RrhhService } from "./rrhh.service";
import { SecuenciasService } from "./secuencias.service";
import { SettingsService } from "./settings.service";
import { SucursalesService } from "./mi-empresa/sucursales.service";
import { TiendaService } from "./tienda.service";
import { TipoClienteService } from "./mi-empresa/tipo-cliente.service";
import { TipoInventarioService } from "./tipo-inventario.service";
import { TipoNegocioService } from "./mi-empresa/tipo-negocio.service";
import { TipoProveedorService } from "./tipo-proveedor.service";
import { TransaccionesService } from "./transacciones.service";
import { TransacionPagosService } from "./transacion-pagos.service";
import { TransportistasService } from "./transportistas.service";
import { UiMessagesService } from "./ui-messages.service";
import { ValidadoresService } from "./validadores.service";
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
    PanelControlService,
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
