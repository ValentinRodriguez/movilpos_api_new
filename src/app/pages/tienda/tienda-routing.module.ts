import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TiendaComponent } from './mantenimiento/tienda.component';



@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
          { path: 'creacion-productos-plaza', component: TiendaComponent },             
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class TiendaRoutingModule { }
