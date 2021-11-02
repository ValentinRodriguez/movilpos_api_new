import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { ClientesComponent } from './mantenimiento/clientes/clientes.component';
import { CondicionesPagoComponent } from './mantenimiento/condiciones-pago/condiciones-pago.component';
import { OrdenesPedidosComponent } from './mantenimiento/ordenes-pedidos/ordenes-pedidos.component';
import { ActoDescargoComponent } from './mantenimiento/acto-descargo/acto-descargo.component';
import { FormularioTiponegocioComponent } from '../empresa/tipo-negocio/formulario-tiponegocio/formulario-tiponegocio.component';
import { FormularioTipoClientesComponent } from '../empresa/tipo-clientes/formulario-tipo-clientes/formulario-tipo-clientes.component';
import { TablaAmortizacionesComponent } from './mantenimiento/tabla-amortizaciones/tabla-amortizaciones.component';
import { InterfazVentas2Component } from './mantenimiento/interfaz-ventas2/interfaz-ventas2.component';
import { FormularioEmpleadosComponent } from '../rrhh/mantenimiento/gestion-empleados/formulario-empleados/formulario-empleados.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: 'gestion-de-clientes', component: ClientesComponent, children:[         
          {path: 'tipo-negocio', component: FormularioTiponegocioComponent},
          { path: 'tipo-cliente', component: FormularioTipoClientesComponent },
          {path: 'vendedor', component: FormularioEmpleadosComponent},
        ]},
        // {path: 'gestion-de-clientes', component: ClientesComponent},
        {path: 'interfaz-ventas', component: InterfazVentas2Component},
        {path: 'gestion-de-ordenes-de-pedidos', component: OrdenesPedidosComponent},
        {path: 'condiciones-de-pago', component: CondicionesPagoComponent},
        {path: 'acto-descargo', component: ActoDescargoComponent},
        {path: 'tabla-amortizaciones', component: TablaAmortizacionesComponent},
        // {path: 'gestion-recepcion-vehiculos', component: RecepcionVehiculosComponent}      
       ]},
    ])
  ],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
