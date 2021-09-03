import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreacionProductosTiendaComponent } from './mantenimiento/creacion-productos-tienda/creacion-productos-tienda.component';
import { AtributosComponent } from './mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/atributos/atributos.component';
import { CrearComponent } from './mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/crear/crear.component';
import { GeneralComponent } from './mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/general/general.component';
import { ProductosCompuestosComponent } from './mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/productos-compuestos/productos-compuestos.component';
import { RecomendadosComponent } from './mantenimiento/creacion-productos-tienda/formulario-creacion-productos-tienda/recomendados/recomendados.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
          {
            path: 'creacion-productos-plaza', component: CreacionProductosTiendaComponent, children: [
              { path: '', redirectTo: 'general', pathMatch: 'full' },             
              { path: 'atributos', component: AtributosComponent },
              // { path: 'variantes', component: AtributosComponent},
              // { path: 'clasificacion', component: ClasificacionComponent},
              // { path: 'envios', component: EnvioComponent},
              { path: 'general', component: GeneralComponent},
              { path: 'productos-enlazados', component: RecomendadosComponent },
              { path: 'productos-compuestos', component: ProductosCompuestosComponent},
              { path: 'crear-producto', component: CrearComponent},
          ]},             
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class TiendaRoutingModule { }
