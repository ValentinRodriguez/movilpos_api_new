import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { EmpresaComponent } from './empresa/empresa.component';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { MonedasComponent } from './monedas/monedas.component';
import { TipoClientesComponent } from './tipo-clientes/tipo-clientes.component';
import { TipoNegocioComponent } from './tipo-negocio/tipo-negocio.component';
import { ZonasComponent } from './zonas/zonas.component';
import { FormularioEmpresaComponent } from './empresa/formulario-empresa/formulario-empresa.component';
import { TiposProveedoresComponent } from './tipos-proveedores/tipos-proveedores.component';


@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
          { path: 'gestion-de-empresa', component: EmpresaComponent },         
          { path: 'gestion-de-tipo-negocios', component: TipoNegocioComponent },        
          { path: 'gestion-de-tipo-clientes', component: TipoClientesComponent },        
          { path: 'gestion-de-monedas', component: MonedasComponent },        
          { path: 'gestion-de-zonas', component: ZonasComponent },
          //  { path: 'gestion-de-sucursales', component: SucursalesComponent },
         { path: 'gestion-tipo-proveedores', component: TiposProveedoresComponent },
          { path: 'gestion-de-sucursales', component: SucursalesComponent, children: [           
           { path: 'empresas', component: FormularioEmpresaComponent }           
         ]},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
