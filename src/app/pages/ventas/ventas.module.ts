//COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

// RUTAS DEL MODULO
import { VentasRoutingModule } from "./ventas-routing.module";

// COMPONENTES DE PRIMENG
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { PipesModule } from 'src/app/pipes/pipes.module';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AccordionModule} from 'primeng/accordion';
import {DataViewModule} from 'primeng/dataview';
import {SidebarModule} from 'primeng/sidebar';

// COMPONENTES DEL MODULO DE VENTAS
import { ClientesComponent } from './mantenimiento/clientes/clientes.component';
import { FormularioClientesComponent } from './mantenimiento/clientes/formulario-clientes/formulario-clientes.component';
import { StepclientesComponent } from './mantenimiento/clientes/stepclientes/stepclientes.component';
import { CondicionesPagoComponent } from './mantenimiento/condiciones-pago/condiciones-pago.component';
import { FormularioCondicionesComponent } from './mantenimiento/condiciones-pago/formulario-condiciones/formulario-condiciones.component';
import { CotizacionesComponent } from './mantenimiento/cotizaciones/cotizaciones.component';
import { InterfazVentasComponent } from './mantenimiento/interfaz-ventas/interfaz-ventas.component';
import { FormularioOrdenesPedidosComponent } from './mantenimiento/ordenes-pedidos/formulario-ordenes-pedidos/formulario-ordenes-pedidos.component';
import { OrdenesPedidosComponent } from './mantenimiento/ordenes-pedidos/ordenes-pedidos.component';
import { StepOrdenesPedidosComponent } from './mantenimiento/ordenes-pedidos/step-ordenes-pedidos/step-ordenes-pedidos.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { RecepcionVehiculosComponent } from './mantenimiento/recepcion-vehiculos/recepcion-vehiculos.component';
import { FormularioRecepcionVehiculosComponent } from './mantenimiento/recepcion-vehiculos/formulario-recepcion-vehiculos/formulario-recepcion-vehiculos.component';
import { FormularioTipoClientesComponent } from '../empresa/tipo-clientes/formulario-tipo-clientes/formulario-tipo-clientes.component';
import { ActoDescargoComponent } from './mantenimiento/acto-descargo/acto-descargo.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    OrdenesPedidosComponent,
    StepOrdenesPedidosComponent,
    FormularioOrdenesPedidosComponent,
    InterfazVentasComponent,
    CotizacionesComponent,
    CondicionesPagoComponent,
    FormularioCondicionesComponent,
    ClientesComponent,
    StepclientesComponent,
    FormularioClientesComponent,
    RecepcionVehiculosComponent,
    FormularioRecepcionVehiculosComponent,
    ActoDescargoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    VentasRoutingModule,
    DropdownModule,
    TableModule,
    SidebarModule,
    SelectButtonModule,
    TabViewModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    DataViewModule,
    AutoCompleteModule,
    AccordionModule,
    OverlayPanelModule,
    CalendarModule,
    ToolbarModule,
    PanelModule,
    FileUploadModule,
    StepsModule,
    ComponentsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InputMaskModule,
    InputNumberModule,
    CheckboxModule,
    PipesModule
  ],
  entryComponents:[
    StepclientesComponent,
    FormularioClientesComponent,
    FormularioTipoClientesComponent
  ]
})
export class VentasModule { }
