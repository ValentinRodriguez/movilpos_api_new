import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreacionProductosTiendaComponent } from './mantenimiento/creacion-productos-tienda/creacion-productos-tienda.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
          { path: 'creacion-productos-plaza', component: CreacionProductosTiendaComponent },             
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class TiendaRoutingModule { }
