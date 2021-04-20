import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { CatalogoCuentasComponent } from './mantenimiento/catalogo-cuentas/catalogo-cuentas.component';
import { EntradaDiarioComponent } from './mantenimiento/entrada-diario/entrada-diario.component';
import { PeriodosFiscalesComponent } from './mantenimiento/periodos-fiscales/periodos-fiscales.component';
import { TransaccionesPagoComponent } from './mantenimiento/transacciones-pago/transacciones-pago.component';
import { GastosDepartamentosComponent } from './reportes/gastos-departamentos/gastos-departamentos.component';
import { MayorGeneralComponent } from './reportes/mayor-general/mayor-general.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: 'gestion-catalogo-cuentas', component: CatalogoCuentasComponent},
        {path: 'gestion-periodos-fiscales', component: PeriodosFiscalesComponent},
        {path: 'gestion-entradas-diario', component: EntradaDiarioComponent},
        {path: 'gestion-transacciones-pago', component: TransaccionesPagoComponent},
        {path: 'gastos-departamento', component: GastosDepartamentosComponent},
        {path: 'reporte-mayor-general', component: MayorGeneralComponent},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ContabilidadGeneralRoutingModule { }
