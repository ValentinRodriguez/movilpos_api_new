//COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

// MODULOS DEL PROYECTO
import { PipesModule } from 'src/app/pipes/pipes.module';

// COMPONENTES DE PRIMENG
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import {InputSwitchModule} from 'primeng/inputswitch';

//MODULOS DE RUTAS DEL PROYECTO
import { PanelControlRoutingModule } from "./panel-control-routing.module";

// COMPONENTES DEL MODULO DE COMPRAS
import { FormularioUsuariosComponent } from './usuarios/formulario-usuarios/formulario-usuarios.component';
import { PermisosUsuariosComponent } from './usuarios/permisos-usuarios/permisos-usuarios.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProcedimientosComponent } from './procedimientos/procedimientos.component';

@NgModule({
  declarations: [
    FormularioUsuariosComponent,
    PermisosUsuariosComponent,
    UsuariosComponent,
    ProcedimientosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule,
    TabViewModule,
    TableModule,
    AccordionModule,
    ToolbarModule,
    DropdownModule,
    InputTextModule,
    PipesModule,
    InputSwitchModule,
    PanelControlRoutingModule
  ],
  entryComponents: [
    PermisosUsuariosComponent,
  ]
})
export class PanelControlModule { }
