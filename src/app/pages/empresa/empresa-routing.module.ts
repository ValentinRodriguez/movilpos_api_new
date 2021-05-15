import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { EmpresaComponent } from './empresa/empresa.component';
import { MonedasComponent } from './monedas/monedas.component';
import { TipoClientesComponent } from './tipo-clientes/tipo-clientes.component';
import { TipoNegocioComponent } from './tipo-negocio/tipo-negocio.component';


@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: 'gestion-de-empresa', component: EmpresaComponent},
        {path: 'gestion-de-tipo-negocios', component: TipoNegocioComponent},
        {path: 'gestion-de-tipo-clientes', component: TipoClientesComponent},
        {path: 'gestion-de-monedas', component: MonedasComponent},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }