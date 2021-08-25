import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormularioSucursalesComponent } from '../empresa/sucursales/formulario-sucursales/formulario-sucursales.component';
import { FormularioAreaEmpresasComponent } from '../rrhh/mantenimiento/areas-empresa/formulario-area-empresas/formulario-area-empresas.component';
import { FormularioEmpleadosComponent } from '../rrhh/mantenimiento/gestion-empleados/formulario-empleados/formulario-empleados.component';
import { FormularioTurnosComponent } from '../rrhh/mantenimiento/turnos/formulario-turnos/formulario-turnos.component';

//COMPONENTES DEL PROYECTO
import { CatalogoCuentasComponent } from './mantenimiento/catalogo-cuentas/catalogo-cuentas.component';
import { CuadreCajaComponent } from './mantenimiento/cuadre-caja/cuadre-caja.component';
import { EntradaDiarioComponent } from './mantenimiento/entrada-diario/entrada-diario.component';
import { PeriodosFiscalesComponent } from './mantenimiento/periodos-fiscales/periodos-fiscales.component';
import { TransaccionesPagoComponent } from './mantenimiento/transacciones-pago/transacciones-pago.component';
import { GastosDepartamentosComponent } from './reportes/gastos-departamentos/gastos-departamentos.component';
import { MayorGeneralComponent } from './reportes/mayor-general/mayor-general.component';
import { EstadosComponent } from './mantenimiento/estados/estados.component';
import { ReporteCatalogoCuentasComponent } from "./reportes/reporte-catalogo-cuentas/reporte-catalogo-cuentas.component";

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: 'gestion-catalogo-cuentas', component: CatalogoCuentasComponent},
        { path: 'gestion-estados', component: EstadosComponent },
         { path: 'gestion-periodos-fiscales', component: PeriodosFiscalesComponent },
         { path: 'reporte-catalogo', component:  ReporteCatalogoCuentasComponent},         
        {path: 'gestion-entradas-diario', component: EntradaDiarioComponent},
        {path: 'gestion-transacciones-pago', component: TransaccionesPagoComponent},
        {path: 'gastos-departamento', component: GastosDepartamentosComponent},
         { path: 'reporte-mayor-general', component: MayorGeneralComponent },
         { path: 'reporte-diario-general', component: MayorGeneralComponent },         
        { path: 'cuadre-caja', component: CuadreCajaComponent, children: [
          { path: 'turnos', component: FormularioTurnosComponent },
          { path: 'sucursales', component: FormularioSucursalesComponent },
          { path: 'empleado-caja', component: FormularioEmpleadosComponent },
          { path: 'area-caja', component: FormularioAreaEmpresasComponent },
        ]}
       ]
      }
    ])
  ],
    
  exports: [RouterModule]
})
export class ContabilidadGeneralRoutingModule { }
