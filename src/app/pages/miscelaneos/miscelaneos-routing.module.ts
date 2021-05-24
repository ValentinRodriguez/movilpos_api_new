import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { GestionActividadesComponent } from './gestion-actividades/gestion-actividades.component';


@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [         
        {path: 'gestion-de-actividades', component: GestionActividadesComponent} 
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MiscelaneosRoutingModule { }
