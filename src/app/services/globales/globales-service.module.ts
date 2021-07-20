import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatosEstaticosService } from "./datos-estaticos.service";
import { DgiiService } from "./dgii.service";
import { GlobalFunctionsService } from "./global-functions.service";
import { HomeService } from "./home.service";
import { MenuesService } from "./menues.service";
import { ModulosService } from "./modulos.service";
import { PaisesCiudadesService } from "./paises-ciudades.service";
import { RolesService } from "./roles.service";
import { SecuenciasService } from "./secuencias.service";
import { SettingsService } from "./settings.service";
import { UiMessagesService } from "./ui-messages.service";
import { ValidadoresService } from "./validadores.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ], providers: [
    DatosEstaticosService,
    DgiiService,
    GlobalFunctionsService,
    HomeService,
    MenuesService,
    ModulosService,
    PaisesCiudadesService,
    RolesService,
    SecuenciasService,
    SettingsService,
    UiMessagesService,
    ValidadoresService
  ]
})
export class GlobalesServiceModule { }
