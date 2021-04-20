//COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

// MODULOS DEL PROYECTO
import { PipesModule } from 'src/app/pipes/pipes.module';

// RUTAS DEL MODULO
import { CuentasPagarRoutingModule } from "./cuentas-pagar-routing.module";

// COMPONENTES DE PRIMENG
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';


// COMPONENTES DEL MODULO DE COMPRAS
import { FacturasProveedoresComponent } from './mantenimiento/facturas-proveedores/facturas-proveedores.component';
import { StepFacturaProvedoresComponent } from './mantenimiento/facturas-proveedores/step-factura-provedores/step-factura-provedores.component';
import { FormularioFacturaProvedoresComponent } from './mantenimiento/facturas-proveedores/formulario-factura-provedores/formulario-factura-provedores.component';
import { AnalisisSaldoComponent } from './reportes/analisis-saldo/analisis-saldo.component';

@NgModule({
  declarations: [
    FacturasProveedoresComponent,
    StepFacturaProvedoresComponent,
    FormularioFacturaProvedoresComponent,
    AnalisisSaldoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CuentasPagarRoutingModule,
    TabViewModule,
    DropdownModule,
    InputNumberModule,
    SelectButtonModule,
    PanelModule,
    TableModule,
    ToolbarModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    PipesModule,
    CalendarModule,
    InputTextareaModule
  ],
  entryComponents: [
    StepFacturaProvedoresComponent,
  ]
})
export class CuentasPagarModule { }
