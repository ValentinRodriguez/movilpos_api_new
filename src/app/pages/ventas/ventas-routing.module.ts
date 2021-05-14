import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { ClientesComponent } from './mantenimiento/clientes/clientes.component';
import { FormularioClientesComponent } from './mantenimiento/clientes/formulario-clientes/formulario-clientes.component';
import { CondicionesPagoComponent } from './mantenimiento/condiciones-pago/condiciones-pago.component';
import { OrdenesPedidosComponent } from './mantenimiento/ordenes-pedidos/ordenes-pedidos.component';
import { RecepcionVehiculosComponent } from './mantenimiento/recepcion-vehiculos/recepcion-vehiculos.component';
import { FormularioCatComponent } from '../inventario/mantenimiento/categorias/formulario-cat/formulario-cat.component';
import { FormularioMarcaComponent } from '../inventario/mantenimiento/marcas/formulario-marca/formulario-marca.component';
import { FormularioPropiedadesComponent } from '../inventario/mantenimiento/propiedades/formulario-propiedades/formulario-propiedades.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: '', component: RecepcionVehiculosComponent, children:[
          // {path:'', redirectTo: 'clientes', pathMatch: 'full'},          
          {path: 'clientes', component: FormularioClientesComponent},
          {path: 'modelos', component: FormularioCatComponent},
          {path: 'marcas', component: FormularioMarcaComponent},
          {path: 'propiedades', component: FormularioPropiedadesComponent},
        ]},
        {path: 'gestion-de-clientes', component: ClientesComponent},
        {path: 'gestion-de-ordenes-de-pedidos', component: OrdenesPedidosComponent},
        {path: 'condiciones-de-pago', component: CondicionesPagoComponent},
        {path: 'gestion-recepcion-vehiculos', component: RecepcionVehiculosComponent}      
       ]},
    ])
  ],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
