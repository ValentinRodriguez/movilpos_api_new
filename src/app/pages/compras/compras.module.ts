//COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

// MODULOS DEL PROYECTO
import { PipesModule } from 'src/app/pipes/pipes.module';

// COMPONENTES DE PRIMENG
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule} from 'primeng/fileupload';
import { FieldsetModule} from 'primeng/fieldset';
import { StepsModule } from 'primeng/steps';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BlockUIModule } from 'primeng/blockui';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { AccordionModule } from 'primeng/accordion';
import { ComponentsModule } from 'src/app/components/components.module';

// RUTAS DEL MODULO
import { ComprasRoutingModule } from "./compras-routing.module";

// COMPONENTES DEL MODULO DE COMPRAS
import { DireccionesEnvioComponent } from './mantenimiento/direcciones-envio/direcciones-envio.component';
import { FormularioDireccionesComponent } from './mantenimiento/direcciones-envio/formulario-direcciones/formulario-direcciones.component';
import { OrdenesComprasComponent } from './mantenimiento/ordenes-compras/ordenes-compras.component';
import { FormularioOrdenesComprasComponent } from './mantenimiento/ordenes-compras/formulario-ordenes-compras/formulario-ordenes-compras.component';
import { ProveedoresComponent } from './mantenimiento/proveedores/proveedores.component';
import { FormularioProveedoresComponent } from './mantenimiento/proveedores/formulario-proveedores/formulario-proveedores.component';
import { StepProveedoresComponent } from './mantenimiento/proveedores/step-proveedores/step-proveedores.component';
import { StepOrdenesComprasComponent } from './mantenimiento/ordenes-compras/step-ordenes-compras/step-ordenes-compras.component';
import { PuertosComponent } from './mantenimiento/puertos/puertos.component';
import { FormularioPuertosComponent } from './mantenimiento/puertos/formulario-puertos/formulario-puertos.component';
import { RequisicionesComponent } from './mantenimiento/requisiciones/requisiciones.component';
import { CatalogoProveedoresComponent } from './reportes/catalogo-proveedores/catalogo-proveedores.component';

@NgModule({
  declarations: [
    DireccionesEnvioComponent,
    FormularioDireccionesComponent,
    OrdenesComprasComponent,
    FormularioOrdenesComprasComponent,
    StepOrdenesComprasComponent,
    ProveedoresComponent,
    FormularioProveedoresComponent,
    StepProveedoresComponent,
    PuertosComponent,
    FormularioPuertosComponent,
    RequisicionesComponent,
    CatalogoProveedoresComponent
  ],
  exports:[

  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AccordionModule,
    ComprasRoutingModule,
    ReactiveFormsModule,
    DropdownModule,
    ConfirmDialogModule,
    TableModule,
    ToastModule,
    TabViewModule,
    InputTextModule,
    PanelModule,
    ToolbarModule,
    AutoCompleteModule,
    CalendarModule,
    FileUploadModule,
    FieldsetModule,
    StepsModule,
    MultiSelectModule,
    OverlayPanelModule,
    BlockUIModule,
    PipesModule,
    InputTextareaModule,
    InputMaskModule,
    ComponentsModule
  ],
  entryComponents:[
    StepProveedoresComponent,
    FormularioProveedoresComponent,
    StepOrdenesComprasComponent
  ]
})
export class ComprasModule { }
