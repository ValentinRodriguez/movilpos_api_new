import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreasEmpresaService } from "./areas-empresa.service";
import { DepartamentosService } from "./departamentos.service";
import { PuestosService } from "./puestos.service";
import { RrhhService } from "./rrhh.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ], providers: [
    AreasEmpresaService,
    DepartamentosService,
    PuestosService,
    RrhhService
  ]
})
export class RrhhServiceModule { }
