import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { DashboardDemoComponent } from './dashboarddemo.component';
import { TestComponent } from './test/test.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: '', component: DashboardDemoComponent, children:[
          {path:'', redirectTo: 'test', pathMatch: 'full'},
          {path: 'test', component: TestComponent},
        ]},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
