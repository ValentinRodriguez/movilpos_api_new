import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { UsuariosComponent } from './usuarios/usuarios.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
         {path: 'gestion-de-usuarios', component: UsuariosComponent}
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class PanelControlRoutingModule { }
