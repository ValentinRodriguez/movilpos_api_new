//COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

// RUTAS DEL MODULO
import { RrhhRoutingModule } from "./rrhh-routing.module";

// COMPONENTES DE PRIMENG
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';

// COMPONENTES DEL MODULO DE RRHH
import { AusenciasComponent } from './mantenimiento/gestion-empleados/ausencias/ausencias.component';
import { AmonestacionesComponent } from './mantenimiento/gestion-empleados/amonestaciones/amonestaciones.component';
import { HorasExtrasComponent } from './mantenimiento/gestion-empleados/horas-extras/horas-extras.component';
import { DescuentosComponent } from './mantenimiento/gestion-empleados/descuentos/descuentos.component';
import { VacacionesComponent } from './mantenimiento/gestion-empleados/vacaciones/vacaciones.component';
import { GestionEmpleadosComponent } from './mantenimiento/gestion-empleados/gestion-empleados.component';
import { FormularioDepartamentosComponent } from './mantenimiento/departamentos/formulario-departamentos/formulario-departamentos.component';
import { DepartamentosComponent } from './mantenimiento/departamentos/departamentos.component';
import { StepEmpleadosComponent } from './mantenimiento/gestion-empleados/step-empleados/step-empleados.component';
import { FormularioEmpleadosComponent } from './mantenimiento/gestion-empleados/formulario-empleados/formulario-empleados.component';
import { FormularioPuestosComponent } from './mantenimiento/puestos/formulario-puestos/formulario-puestos.component';
import { PuestosComponent } from './mantenimiento/puestos/puestos.component';
import { AreasComponent } from './mantenimiento/areas/areas.component';

@NgModule({
  declarations: [
    PuestosComponent,
    FormularioPuestosComponent,
    DepartamentosComponent,
    FormularioDepartamentosComponent,
    GestionEmpleadosComponent,
    VacacionesComponent,
    StepEmpleadosComponent,
    HorasExtrasComponent,
    FormularioEmpleadosComponent,
    DescuentosComponent,
    AusenciasComponent,
    AmonestacionesComponent,
    AreasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RrhhRoutingModule,
    ReactiveFormsModule,
    TableModule,
    ConfirmDialogModule,
    ToastModule,
    TabViewModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    AutoCompleteModule,
    InputNumberModule,
    FieldsetModule,
    ButtonModule,
    InputTextareaModule
  ],
  entryComponents: [
    AusenciasComponent,
    AmonestacionesComponent,
    HorasExtrasComponent,
    DescuentosComponent,
    VacacionesComponent,
    StepEmpleadosComponent,
  ]
})
export class RrhhModule { }
