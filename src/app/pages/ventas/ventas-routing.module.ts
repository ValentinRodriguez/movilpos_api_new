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
        {path: 'estion-recepcion-vehiculos', component: RecepcionVehiculosComponent, children:[      
          {path: 'clientes', component: FormularioClientesComponent},
          {path: 'modelos', component: FormularioCatComponent},
          {path: 'marcas', component: FormularioMarcaComponent},
          {path: 'propiedades', component: FormularioPropiedadesComponent},
        ]},
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
