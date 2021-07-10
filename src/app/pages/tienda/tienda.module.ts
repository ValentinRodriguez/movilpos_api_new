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

// COMPONENTES DEL MODULO
import { TiendaComponent } from "./mantenimiento/tienda.component";
import { FormularioTiendaComponent } from "./mantenimiento/formulario-tienda/formulario-tienda.component";
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    TiendaComponent,
    FormularioTiendaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PipesModule,
    InputTextModule,
    TiendaRoutingModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    TabViewModule
  ]
})
export class TiendaModule { }
