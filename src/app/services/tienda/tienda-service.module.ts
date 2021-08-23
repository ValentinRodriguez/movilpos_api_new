import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiendaService } from "./tienda.service";
import { CategoriasStoreService } from "./categorias-store.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ], providers: [
    TiendaService,
    CategoriasStoreService
  ]
})
export class TiendaServiceModule { }
