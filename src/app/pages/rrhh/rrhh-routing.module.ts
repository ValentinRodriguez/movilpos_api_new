import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { DepartamentosComponent } from './mantenimiento/departamentos/departamentos.component';
import { GestionEmpleadosComponent } from './mantenimiento/gestion-empleados/gestion-empleados.component';
import { PuestosComponent } from './mantenimiento/puestos/puestos.component';


@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: 'gestion-de-empleados', component: GestionEmpleadosComponent},
        {path: 'gestion-de-departamentos', component: DepartamentosComponent},
        {path: 'gestion-de-puestos', component: PuestosComponent},  
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class RrhhRoutingModule { }
