import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComprasServiceModule } from './compras/compras.module';
import { ContabilidadServiceModule } from "./contabilidad/contabilidad-service.module";
import { CuentasXpagarServiceModule } from "./cuentas-pagar/cuentas-xpagar-service.module";
import { GlobalesServiceModule } from "./globales/globales-service.module";
import { InventarioServiceModule } from "./inventario/inventario-service.module";
import { MiEmpresaServiceModule } from "./mi-empresa/mi-empresa-service.module";
import { MiscelaneosServiceModule } from "./miscelaneos/miscelaneos-service.module";
import { RrhhServiceModule } from "./rrhh/rrhh-service.module";
import { TiendaServiceModule } from "./tienda/tienda-service.module";
import { VentasServiceModule } from "./ventas/ventas-service.module";
import { CryptModule } from "./crypt/crypt.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComprasServiceModule,
    ContabilidadServiceModule,
    CuentasXpagarServiceModule,
    GlobalesServiceModule,
    InventarioServiceModule,
    MiEmpresaServiceModule,
    MiscelaneosServiceModule,
    RrhhServiceModule,
    TiendaServiceModule,
    VentasServiceModule,
    CryptModule
  ]
})
export class ServicesModule { }
