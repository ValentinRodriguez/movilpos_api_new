import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { BodegasComponent } from './mantenimiento/bodegas/bodegas.component';
import { CategoriasComponent } from './mantenimiento/categorias/categorias.component';
import { ExistenciasAlmacenesComponent } from './mantenimiento/existencias-almacenes/existencias-almacenes.component';
import { MaestraProductosComponent } from './mantenimiento/maestra-productos/maestra-productos.component';
import { MarcasComponent } from './mantenimiento/marcas/marcas.component';
import { PropiedadesComponent } from './mantenimiento/propiedades/propiedades.component';
import { TiposInventariosComponent } from './mantenimiento/tipos-inventarios/tipos-inventarios.component';
import { TiposMovimientosComponent } from './mantenimiento/tipos-movimientos/tipos-movimientos.component';
import { TransaccionesInventarioComponent } from './mantenimiento/transacciones-inventario/transacciones-inventario.component';
import { TransportistasComponent } from './mantenimiento/transportistas/transportistas.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: 'gestion-de-productos', component: MaestraProductosComponent},
        {path: 'gestion-de-bodegas', component: BodegasComponent},     
        {path: 'gestion-de-modelos', component: CategoriasComponent},                 
        {path: 'gestion-tipos-inventarios', component: TiposInventariosComponent}, 
        {path: 'gestion-de-marcas', component: MarcasComponent},
        {path: 'gestion-tipos-movimientos', component: TiposMovimientosComponent},  
        {path: 'gestion-transacciones-inventario', component: TransaccionesInventarioComponent},
        {path: 'gestion-de-transportistas', component: TransportistasComponent},
        {path: 'gestion-de-propiedades', component: PropiedadesComponent},
        {path: 'existencias-almacenes', component: ExistenciasAlmacenesComponent},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
