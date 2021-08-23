import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { DashboardDemoComponent } from './dashboarddemo.component';
import { FormularioEmpresaComponent } from '../empresa/empresa/formulario-empresa/formulario-empresa.component';
import { FormularioCgcatalogoComponent } from '../contabilidad-general/mantenimiento/catalogo-cuentas/formulario-cgcatalogo/formulario-cgcatalogo.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: '', component: DashboardDemoComponent, children:[
          // {path:'', redirectTo: 'empresa', pathMatch: 'full'},
          {path: 'empresa', component: FormularioEmpresaComponent},
          {path: 'catalogo', component: FormularioCgcatalogoComponent},
        ]},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
