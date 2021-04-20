import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenPedidosService } from "./orden-pedidos.service";
import { ValidadoresService } from "./validadores.service";
import { OrdenescomprasService } from "./ordenescompras.service";
import { CondicionesPagoService } from "./condiciones-pago.service";
import { MonedasService } from "./monedas.service";
import { ActividadesService } from "./actividades.service";
import { ModulosService } from "./modulos.service";
import { MenuesService } from "./menues.service";
import { SettingsService } from "./settings.service";
import { InventarioService } from "./inventario.service";
import { BodegasService } from "./bodegas.service";
import { PaisesCiudadesService } from "./paises-ciudades.service";
import { UiMessagesService } from "./ui-messages.service";
import { CategoriasService } from "./categorias.service";
import { TipoInventarioService } from "./tipo-inventario.service";
import { CgcatalogoService } from "./cgcatalogo.service";
import { BrandsService } from "./brands.service";
import { CodMovService } from "./cod-mov.service";
import { DatosEstaticosService } from "./datos-estaticos.service";
import { TransaccionesService } from "./transacciones.service";
import { FacturasService } from "./facturas.service";
import { DepartamentosService } from "./departamentos.service";
import { ProveedoresService } from "./proveedores.service";
import { TransportistasService } from "./transportistas.service";
import { RrhhService } from "./rrhh.service";
import { ClientesService } from "./clientes.service";
import { EmpresaService } from "./empresa.service";
import { PuestosService } from "./puestos.service";
import { RolesService } from "./roles.service";
import { RequisicionesService } from "./requisiciones.service";
import { ZonasService } from "./zonas.service";
import { TipoProveedorService } from "./tipo-proveedor.service";
import { HomeService } from "./home.service";
import { PropiedadesService } from "./propiedades.service";
import { PeriodosFiscalesService } from "./periodos-fiscales.service";
import { TipoClienteService } from "./tipo-cliente.service";
import { TipoNegocioService } from "./tipo-negocio.service";
import { PuertosService } from "./puertos.service";
import { DireccionesService } from "./direcciones.service";

import { SecuenciasService } from "./secuencias.service";
import { DgiiService } from "./dgii.service";
import { GlobalFunctionsService } from "./global-functions.service";
import { TiendaService } from "./tienda.service";
import { CoTransaccionescxpService } from './co-transaccionescxp.service';
import { EntradasDiarioService } from './entradas-diario.service';
import { TransacionPagosService } from "./transacion-pagos.service";
import { ExistenciaAlmacenesService } from "./existencia-almacenes.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ModulosService,
    MenuesService,
    SettingsService,
    InventarioService,
    BodegasService,
    PaisesCiudadesService,
    UiMessagesService,
    CategoriasService,
    TipoInventarioService,
    CgcatalogoService,
    BrandsService,
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
    ExistenciaAlmacenesService
  ]
})
export class ServicesModule { }
