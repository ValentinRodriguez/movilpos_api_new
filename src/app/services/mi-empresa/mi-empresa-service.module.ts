import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaService } from "./empresa.service";
import { MonedasService } from "./monedas.service";
import { SucursalesService } from "./sucursales.service";
import { TipoClienteService } from "./tipo-cliente.service";
import { TipoNegocioService } from "./tipo-negocio.service";
import { TipoProveedorService } from "./tipo-proveedor.service";
import { ZonasService } from "./zonas.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ], providers: [
    EmpresaService,
    MonedasService,
    SucursalesService,
    TipoClienteService,
    TipoNegocioService,
    TipoProveedorService,
    ZonasService
  ]
})
export class MiEmpresaServiceModule { }
