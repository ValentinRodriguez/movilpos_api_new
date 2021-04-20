import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

// COMPONENTES DE PRIMENG
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { StepsModule } from 'primeng/steps';
import {ToastModule} from 'primeng/toast';

import { HomeRoutingModule } from "./home-routing.module";

// COMPONENTES DEL MODULO HOME
import { DashboardDemoComponent } from './dashboarddemo.component';
import { StepHomeComponent } from './step-home/step-home.component';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    DashboardDemoComponent,
    StepHomeComponent,
    TestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    TabViewModule,
    TableModule,
    MenuModule,
    ChartModule,
    DropdownModule,
    ButtonModule,
    ToolbarModule,
    StepsModule,
    ToastModule
  ],
  entryComponents:[ 
      StepHomeComponent
  ]
})
export class HomeModule { }
