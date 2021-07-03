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
import { StepsModule } from 'primeng/steps';
import { AccordionModule } from 'primeng/accordion';

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
import { TurnosComponent } from './mantenimiento/turnos/turnos.component';
import { FormularioTurnosComponent } from "./mantenimiento/turnos/formulario-turnos/formulario-turnos.component";
import { AreasEmpresaComponent } from './mantenimiento/areas-empresa/areas-empresa.component';
import { FormularioAreaEmpresasComponent } from './mantenimiento/areas-empresa/formulario-area-empresas/formulario-area-empresas.component';
<<<<<<< HEAD
import { ComponentsModule } from 'src/app/components/components.module';
=======
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { StepsModule } from 'primeng/steps';
import { AccordionModule } from 'primeng/accordion';
>>>>>>> 660e5c1792b63e42de9b6583b0a63e28f331a793

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
    TurnosComponent,
    FormularioTurnosComponent,
    AreasEmpresaComponent,
    FormularioAreaEmpresasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RrhhRoutingModule,
    ReactiveFormsModule,
    StepsModule,
    AccordionModule,
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
<<<<<<< HEAD
    InputTextareaModule,
    ComponentsModule
=======
    ComponentsModule,
    StepsModule,
    AccordionModule,
    PipesModule,
    InputTextareaModule
>>>>>>> 660e5c1792b63e42de9b6583b0a63e28f331a793
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
