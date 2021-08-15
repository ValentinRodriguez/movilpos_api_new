// COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

// MODULOS DEL PROYECTO
import { PipesModule } from '../../pipes/pipes.module';

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
// COMPONENTES DEL MODULO
import { CreacionProductosTiendaComponent } from "./mantenimiento/creacion-productos-tienda/creacion-productos-tienda.component"; 
import { FormularioCreacionProductosTiendaComponent } from "./mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/formulario-creacion-productos-tienda.component";
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
@NgModule({
  declarations: [
    CreacionProductosTiendaComponent,
    FormularioCreacionProductosTiendaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    AutoCompleteModule,
    FieldsetModule,
    ReactiveFormsModule,
    RouterModule,
    PipesModule,
    DropdownModule,
    DataViewModule,
    InputTextModule,
    TiendaRoutingModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    TabViewModule
  ]
})
export class TiendaModule { }
