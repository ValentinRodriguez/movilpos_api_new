import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormularioProveedoresComponent } from '../compras/mantenimiento/proveedores/formulario-proveedores/formulario-proveedores.component';
import { FormularioTiponegocioComponent } from '../empresa/tipo-negocio/formulario-tiponegocio/formulario-tiponegocio.component';
import { FormularioDepartamentosComponent } from '../rrhh/mantenimiento/departamentos/formulario-departamentos/formulario-departamentos.component';
import { FormularioEmpleadosComponent } from '../rrhh/mantenimiento/gestion-empleados/formulario-empleados/formulario-empleados.component';
import { FormularioClientesComponent } from '../ventas/mantenimiento/clientes/formulario-clientes/formulario-clientes.component';

//COMPONENTES DEL PROYECTO
import { BodegasComponent } from './mantenimiento/bodegas/bodegas.component';
import { FormularioBodegasComponent } from './mantenimiento/bodegas/formulario-bodegas/formulario-bodegas.component';
import { CategoriasComponent } from './mantenimiento/categorias/categorias.component';
import { FormularioCatComponent } from './mantenimiento/categorias/formulario-cat/formulario-cat.component';
import { CostoStandardComponent } from './mantenimiento/costo-standard/costo-standard.component';
import { ExistenciasAlmacenesComponent } from './mantenimiento/existencias-almacenes/existencias-almacenes.component';
import { LiquidacionMercanciasComponent } from './mantenimiento/liquidacion-mercancias/liquidacion-mercancias.component';
import { FormularioMaestraProductosComponent } from './mantenimiento/maestra-productos/formulario-maestra-productos/formulario-maestra-productos.component';
import { MaestraProductosComponent } from './mantenimiento/maestra-productos/maestra-productos.component';
import { FormularioMarcaComponent } from './mantenimiento/marcas/formulario-marca/formulario-marca.component';
import { MarcasComponent } from './mantenimiento/marcas/marcas.component';
import { FormularioPropiedadesComponent } from './mantenimiento/propiedades/formulario-propiedades/formulario-propiedades.component';
import { PropiedadesComponent } from './mantenimiento/propiedades/propiedades.component';
import { FormularioTipoinvComponent } from './mantenimiento/tipos-inventarios/formulario-tipoinv/formulario-tipoinv.component';
import { TiposInventariosComponent } from './mantenimiento/tipos-inventarios/tipos-inventarios.component';
import { FormularioTipoMovComponent } from './mantenimiento/tipos-movimientos/formulario-tipo-mov/formulario-tipo-mov.component';
import { TiposMovimientosComponent } from './mantenimiento/tipos-movimientos/tipos-movimientos.component';
import { TransaccionesInventarioComponent } from './mantenimiento/transacciones-inventario/transacciones-inventario.component';
import { FormularioTransportistaComponent } from './mantenimiento/transportistas/formulario-transportista/formulario-transportista.component';
import { TransportistasComponent } from './mantenimiento/transportistas/transportistas.component';
import { ReporteCatalogoProductosComponent } from './reportes/reporte-catalogo-productos/reporte-catalogo-productos.component';
import { ReporteOperacionesMovimientoComponent } from './reportes/reporte-operaciones-movimiento/reporte-operaciones-movimiento.component';

@NgModule({ 
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: 'gestion-transacciones-inventario', component: TransaccionesInventarioComponent, children:[
          {path: 'clientes', component: FormularioClientesComponent},
          {path: 'transportista', component: FormularioTransportistaComponent},
          {path: 'proveedores', component: FormularioProveedoresComponent},
          {path: 'movimientos', component: FormularioTipoMovComponent},
          {path: 'productos', component: FormularioMaestraProductosComponent},
          { path: 'tipo-negocio', component: FormularioTiponegocioComponent },
          { path: 'vendedor', component: FormularioEmpleadosComponent },
          {path: 'departamentos', component: FormularioDepartamentosComponent},
        ]},
        {path: 'gestion-de-productos', component: MaestraProductosComponent, children:[
          {path: 'tipo-inventario', component: FormularioTipoinvComponent},
          {path: 'marcas', component: FormularioMarcaComponent},
          {path: 'modelos', component: FormularioCatComponent},
          {path: 'color', component: FormularioPropiedadesComponent}
        ]},
        // {path: 'gestion-de-productos', component: MaestraProductosComponent},
        {path: 'gestion-de-bodegas', component: BodegasComponent},     
        {path: 'gestion-de-modelos', component: CategoriasComponent},                 
        {path: 'gestion-tipos-inventarios', component: TiposInventariosComponent}, 
        {path: 'gestion-de-marcas', component: MarcasComponent},
        {path: 'gestion-tipos-movimientos', component: TiposMovimientosComponent},  
        // {path: 'gestion-transacciones-inventario', component: TransaccionesInventarioComponent},
        {path: 'gestion-de-transportistas', component: TransportistasComponent},
        {path: 'gestion-de-propiedades', component: PropiedadesComponent},
        {path: 'gestion-existencias-almacenes', component: ExistenciasAlmacenesComponent},
         { path: 'gestion-liquidacion-mercancias', component: LiquidacionMercanciasComponent },
         { path: 'gestion-costo-standard', component: CostoStandardComponent },
         { path: 'reporte-catalogo-productos', component:  ReporteCatalogoProductosComponent},
         { path: 'reporte-operaciones-por-movimientos', component:  ReporteOperacionesMovimientoComponent},
         
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
