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
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { ProgressBarModule } from 'primeng/progressbar';

//RUTAS DEL COMPONENTE
import { HomeRoutingModule } from "./home-routing.module";

// COMPONENTES DEL MODULO HOME
import { DashboardDemoComponent } from './dashboarddemo.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { CardsComponent } from './cards/cards.component';
import { ChartMenuComponent } from './chart-menu/chart-menu.component';
import { ChartTableComponent } from './chart-table/chart-table.component';
import { ChartTaskComponent } from './chart-task/chart-task.component';
import { ChartPieComponent } from "./chart-pie/chart-pie.component";
import { ChartTopListComponent } from "./chart-top-list/chart-top-list.component";

@NgModule({
  declarations: [
    DashboardDemoComponent,
    CardsComponent,
    ChartMenuComponent,
    ChartTableComponent,
    ChartTaskComponent,
    ChartPieComponent,
    ChartTopListComponent
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
    ProgressBarModule,
    ToolbarModule,
    StepsModule,
    ToastModule,
    AccordionModule,
    ComponentsModule
  ],
  entryComponents:[ ]
})
export class HomeModule { }
