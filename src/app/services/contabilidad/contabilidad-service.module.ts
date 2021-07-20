import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CgcatalogoService } from "./cgcatalogo.service";
import { CuadresService } from "./cuadres.service";
import { EntradasDiarioService } from "./entradas-diario.service";
import { PeriodosFiscalesService } from "./periodos-fiscales.service";
import { TransacionPagosService } from "./transacion-pagos.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    CuadresService,
    CgcatalogoService,
    PeriodosFiscalesService,
    TransacionPagosService,
    EntradasDiarioService,
  ]
})
export class ContabilidadServiceModule { }
