import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormularioProveedoresComponent } from '../compras/mantenimiento/proveedores/formulario-proveedores/formulario-proveedores.component';
import { FormularioClientesComponent } from '../ventas/mantenimiento/clientes/formulario-clientes/formulario-clientes.component';

//COMPONENTES DEL PROYECTO
import { BodegasComponent } from './mantenimiento/bodegas/bodegas.component';
import { CategoriasComponent } from './mantenimiento/categorias/categorias.component';
import { ExistenciasAlmacenesComponent } from './mantenimiento/existencias-almacenes/existencias-almacenes.component';
import { LiquidacionMercanciasComponent } from './mantenimiento/liquidacion-mercancias/liquidacion-mercancias.component';
import { FormularioMaestraProductosComponent } from './mantenimiento/maestra-productos/formulario-maestra-productos/formulario-maestra-productos.component';
import { MaestraProductosComponent } from './mantenimiento/maestra-productos/maestra-productos.component';
import { MarcasComponent } from './mantenimiento/marcas/marcas.component';
import { PropiedadesComponent } from './mantenimiento/propiedades/propiedades.component';
import { TiposInventariosComponent } from './mantenimiento/tipos-inventarios/tipos-inventarios.component';
import { FormularioTipoMovComponent } from './mantenimiento/tipos-movimientos/formulario-tipo-mov/formulario-tipo-mov.component';
import { TiposMovimientosComponent } from './mantenimiento/tipos-movimientos/tipos-movimientos.component';
import { TransaccionesInventarioComponent } from './mantenimiento/transacciones-inventario/transacciones-inventario.component';
import { FormularioTransportistaComponent } from './mantenimiento/transportistas/formulario-transportista/formulario-transportista.component';
import { TransportistasComponent } from './mantenimiento/transportistas/transportistas.component';

@NgModule({ 
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: '', component: TransaccionesInventarioComponent, children:[
          {path: 'clientes', component: FormularioClientesComponent},
          {path: 'transportistas', component: FormularioTransportistaComponent},
          {path: 'proveedores', component: FormularioProveedoresComponent},
          {path: 'movimientos', component: FormularioTipoMovComponent},
          {path: 'productos', component: FormularioMaestraProductosComponent},
        ]},
        {path: 'gestion-de-productos', component: MaestraProductosComponent},
        {path: 'gestion-de-bodegas', component: BodegasComponent},     
        {path: 'gestion-de-modelos', component: CategoriasComponent},                 
        {path: 'gestion-tipos-inventarios', component: TiposInventariosComponent}, 
        {path: 'gestion-de-marcas', component: MarcasComponent},
        {path: 'gestion-tipos-movimientos', component: TiposMovimientosComponent},  
        {path: 'gestion-transacciones-inventario', component: TransaccionesInventarioComponent},
        {path: 'gestion-de-transportistas', component: TransportistasComponent},
        {path: 'gestion-de-propiedades', component: PropiedadesComponent},
        {path: 'gestion-existencias-almacenes', component: ExistenciasAlmacenesComponent},
        {path: 'gestion-liquidacion-mercancias', component: LiquidacionMercanciasComponent},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
