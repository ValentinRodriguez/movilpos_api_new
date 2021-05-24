//COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RUTAS DEL MODULO
import { MiscelaneosRoutingModule } from "./miscelaneos-routing.module";

// COMPONENTES DE PRIMENG
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';

// COMPONENTES DEL MODULO MISCELANEOS
import { GestionActividadesComponent } from './gestion-actividades/gestion-actividades.component';

@NgModule({
  declarations: [
    GestionActividadesComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    RouterModule,
    MiscelaneosRoutingModule,
    FullCalendarModule,
    TabViewModule,
    ToastModule,
    InputTextModule
  ]
})
export class MiscelaneosModule { }
