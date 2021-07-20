import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DireccionesService } from "./direcciones.service";
import { OrdenescomprasService } from "./ordenescompras.service";
import { ProveedoresService } from "./proveedores.service";
import { PuertosService } from "./puertos.service";
import { RequisicionesService } from "./requisiciones.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    DireccionesService,
    OrdenescomprasService,
    ProveedoresService,
    PuertosService,
    RequisicionesService
  ]
})
export class ComprasServiceModule { }
