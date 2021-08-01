import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoTransaccionescxpService } from './co-transaccionescxp.service';
import { GestionDocNcdcService } from "./gestion-doc-ncdc.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    CoTransaccionescxpService,
    GestionDocNcdcService
  ]
})
export class CuentasXpagarServiceModule { }
