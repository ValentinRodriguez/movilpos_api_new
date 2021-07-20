import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BodegasService } from "./bodegas.service";
import { BrandsService } from "./brands.service";
import { CategoriasService } from "./categorias.service";
import { CodMovService } from "./cod-mov.service";
import { InventarioService } from "./inventario.service";
import { LiquidacionMercanciasService } from "./liquidacion-mercancias.service";
import { PropiedadesService } from "./propiedades.service";
import { TipoInventarioService } from "./tipo-inventario.service";
import { TransaccionesService } from "./transacciones.service";
import { TransportistasService } from "./transportistas.service";
import { ExistenciaAlmacenesService } from "./existencia-almacenes.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ], providers: [
    BodegasService,
    BrandsService,
    CategoriasService,
    CodMovService,
    InventarioService,
    LiquidacionMercanciasService,
    PropiedadesService,
    TipoInventarioService,
    TransaccionesService,
    TransportistasService,
    ExistenciaAlmacenesService
  ]
})
export class InventarioServiceModule { }
