import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TurnosComponent } from './mantenimiento/turnos/turnos.component';

//COMPONENTES DEL PROYECTO
import { DepartamentosComponent } from './mantenimiento/departamentos/departamentos.component';
import { GestionEmpleadosComponent } from './mantenimiento/gestion-empleados/gestion-empleados.component';
import { PuestosComponent } from './mantenimiento/puestos/puestos.component';
import { AreasEmpresaComponent } from './mantenimiento/areas-empresa/areas-empresa.component';
import { FormularioDepartamentosComponent } from './mantenimiento/departamentos/formulario-departamentos/formulario-departamentos.component';
import { FormularioSucursalesComponent } from '../empresa/sucursales/formulario-sucursales/formulario-sucursales.component';
import { FormularioEmpresaComponent } from '../empresa/empresa/formulario-empresa/formulario-empresa.component';
import { FormularioTurnosComponent } from './mantenimiento/turnos/formulario-turnos/formulario-turnos.component';
import { FormularioPuestosComponent } from './mantenimiento/puestos/formulario-puestos/formulario-puestos.component';
import { FormularioMonedasComponent } from '../empresa/monedas/formulario-monedas/formulario-monedas.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: '', component: AreasEmpresaComponent, children:[
          {path: 'departamentos', component: FormularioDepartamentosComponent},
          {path: 'sucursales', component: FormularioSucursalesComponent},
          {path: 'empresa', component: FormularioEmpresaComponent},
        ]},
         {
           path: '', component: GestionEmpleadosComponent, children: [
            { path: 'horarios', component: FormularioTurnosComponent },
            { path: 'puestos', component: FormularioPuestosComponent},
            { path: 'departamento', component: FormularioDepartamentosComponent },
            { path: 'monedas', component: FormularioMonedasComponent },
            { path: 'bancos', component: FormularioDepartamentosComponent },
            { path: 'tipoEmpleado', component: FormularioDepartamentosComponent },
            { path: 'sucursal', component: FormularioSucursalesComponent},
            { path: 'empresas', component: FormularioEmpresaComponent},
        ]},
         { path: 'gestion-de-empleados', component: GestionEmpleadosComponent },         
         { path: 'gestion-de-departamentos', component: DepartamentosComponent },        
         { path: 'gestion-de-puestos', component: PuestosComponent },
         { path: 'gestion-de-areas', component: AreasEmpresaComponent },
         { path: 'gestion-tipo-turnos', component: TurnosComponent }
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class RrhhRoutingModule { }
