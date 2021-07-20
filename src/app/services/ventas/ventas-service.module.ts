import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesService } from "./clientes.service";
import { CondicionesPagoService } from "./condiciones-pago.service";
import { FacturasService } from "./facturas.service";
import { OrdenPedidosService } from "./orden-pedidos.service";
import { RecepcionVehiculosService } from "./recepcion-vehiculos.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ], providers: [
    ClientesService,
    CondicionesPagoService,
    FacturasService,
    OrdenPedidosService,
    RecepcionVehiculosService
  ]
})
export class VentasServiceModule { }
