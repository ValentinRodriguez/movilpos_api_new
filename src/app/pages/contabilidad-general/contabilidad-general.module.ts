//COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { CalendarModule } from 'primeng/calendar';

// MODULOS DEL PROYECTO
import { PipesModule } from 'src/app/pipes/pipes.module';

// COMPONENTES DE PRIMENG
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { InputMaskModule } from 'primeng/inputmask';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';

//RUTAS DEL MODULO
import { ContabilidadGeneralRoutingModule } from "./contabilidad-general-routing.module";

// COMPONENTES DEL MODULO DE COMPRAS
import { FormularioCgcatalogoComponent } from './mantenimiento/catalogo-cuentas/formulario-cgcatalogo/formulario-cgcatalogo.component';
import { CatalogoCuentasComponent } from './mantenimiento/catalogo-cuentas/catalogo-cuentas.component';
import { EntradaDiarioComponent } from './mantenimiento/entrada-diario/entrada-diario.component';
import { FormularioEntradaDiarioComponent } from './mantenimiento/entrada-diario/formulario-entrada-diario/formulario-entrada-diario.component';
import { ActPeriodosComponent } from './mantenimiento/periodos-fiscales/act-periodos/act-periodos.component';
import { FormularioPeriodoFiscalesComponent } from './mantenimiento/periodos-fiscales/formulario-periodo-fiscales/formulario-periodo-fiscales.component';
import { PeriodosFiscalesComponent } from './mantenimiento/periodos-fiscales/periodos-fiscales.component';
import { TransaccionesPagoComponent } from './mantenimiento/transacciones-pago/transacciones-pago.component';
import { FormularioTransaccionesPagoComponent } from './mantenimiento/transacciones-pago/formulario-transacciones-pago/formulario-transacciones-pago.component';
import { StepTransaccionesPagoComponent } from './mantenimiento/transacciones-pago/step-transacciones-pago/step-transacciones-pago.component';
import { GastosDepartamentosComponent } from './reportes/gastos-departamentos/gastos-departamentos.component';
import { MayorGeneralComponent } from './reportes/mayor-general/mayor-general.component';
import { CuadreCajaComponent } from './mantenimiento/cuadre-caja/cuadre-caja.component';
import { FormularioCuadreCajaComponent } from './mantenimiento/cuadre-caja/formulario-cuadre-caja/formulario-cuadre-caja.component';

@NgModule({
  declarations: [
    CatalogoCuentasComponent,
    FormularioCgcatalogoComponent,
    EntradaDiarioComponent,
    FormularioEntradaDiarioComponent,
    PeriodosFiscalesComponent,
    FormularioPeriodoFiscalesComponent,
    ActPeriodosComponent,
    TransaccionesPagoComponent,
    FormularioTransaccionesPagoComponent,
    StepTransaccionesPagoComponent,
    MayorGeneralComponent,
    GastosDepartamentosComponent,
    CuadreCajaComponent,
    FormularioCuadreCajaComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule,
    ContabilidadGeneralRoutingModule,
    ConfirmDialogModule,
    TableModule,
    ToggleButtonModule,
    DropdownModule,
    ToastModule,
    TabViewModule,
    ToolbarModule,
    PanelModule,
    InputMaskModule,
    CalendarModule,
    AutoCompleteModule,
    InputTextModule,
    PipesModule,
    InputNumberModule,
    ProgressBarModule,
    InputTextareaModule
  ], 
  entryComponents: [
    FormularioCgcatalogoComponent,
    ActPeriodosComponent
  ]
})
export class ContabilidadGeneralModule { }
