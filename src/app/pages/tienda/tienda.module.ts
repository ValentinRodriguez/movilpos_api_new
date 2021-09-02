// COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

// MODULOS DEL PROYECTO
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';

// RUTAS DEL MODULO
import { TiendaRoutingModule } from "./tienda-routing.module";

// MODULOS PRIMENG
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import {DataViewModule} from 'primeng/dataview';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import { StepsModule } from 'primeng/steps';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import {CalendarModule} from 'primeng/calendar';
import {TooltipModule} from 'primeng/tooltip';
import {PanelMenuModule} from 'primeng/panelmenu';
import {TreeModule} from 'primeng/tree';
import {RadioButtonModule} from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import {ColorPickerModule} from 'primeng/colorpicker';

// COMPONENTES DEL MODULO
import { CreacionProductosTiendaComponent } from "./mantenimiento/creacion-productos-tienda/creacion-productos-tienda.component"; 
import { FormularioCreacionProductosTiendaComponent } from "./mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/formulario-creacion-productos-tienda.component";
import { GeneralComponent } from './mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/general/general.component';
import { EnvioComponent } from './mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/envio/envio.component';
import { RecomendadosComponent } from './mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/recomendados/recomendados.component';
import { AtributosComponent } from './mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/atributos/atributos.component';
import { ClasificacionComponent } from './mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/clasificacion/clasificacion.component';
import { CrearComponent } from './mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/crear/crear.component';

@NgModule({
  declarations: [
    CreacionProductosTiendaComponent,
    FormularioCreacionProductosTiendaComponent,
    GeneralComponent,
    EnvioComponent,
    RecomendadosComponent,
    AtributosComponent,
    ClasificacionComponent,
    CrearComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    AutoCompleteModule,
    PanelModule,
    InputNumberModule,
    ToolbarModule,
    PanelMenuModule,
    RadioButtonModule,
    ColorPickerModule,
    SelectButtonModule,
    FieldsetModule,
    TreeModule,
    TooltipModule,
    InputTextareaModule,
    FileUploadModule,
    ReactiveFormsModule,
    CheckboxModule,
    RouterModule,
    CalendarModule,
    ComponentsModule,
    PipesModule,
    InputNumberModule,
    StepsModule,
    DropdownModule,
    DataViewModule,
    InputTextModule,
    CardModule,
    TiendaRoutingModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    TabViewModule
  ]
})
export class TiendaModule { }
