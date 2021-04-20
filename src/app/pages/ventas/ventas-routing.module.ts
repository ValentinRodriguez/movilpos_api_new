import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { ClientesComponent } from './mantenimiento/clientes/clientes.component';
import { CondicionesPagoComponent } from './mantenimiento/condiciones-pago/condiciones-pago.component';
import { OrdenesPedidosComponent } from './mantenimiento/ordenes-pedidos/ordenes-pedidos.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: 'gestion-de-clientes', component: ClientesComponent},
        {path: 'gestion-de-ordenes-de-pedidos', component: OrdenesPedidosComponent},
        {path: 'condiciones-de-pago', component: CondicionesPagoComponent},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
