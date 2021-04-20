import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { DireccionesEnvioComponent } from './mantenimiento/direcciones-envio/direcciones-envio.component';
import { OrdenesComprasComponent } from './mantenimiento/ordenes-compras/ordenes-compras.component';
import { ProveedoresComponent } from './mantenimiento/proveedores/proveedores.component';
import { PuertosComponent } from './mantenimiento/puertos/puertos.component';
import { RequisicionesComponent } from './mantenimiento/requisiciones/requisiciones.component';
import { CatalogoProveedoresComponent } from './reportes/catalogo-proveedores/catalogo-proveedores.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: 'gestion-de-proveedores', component: ProveedoresComponent},
        {path: 'gestion-de-ordenes-compras', component: OrdenesComprasComponent},
        {path: 'gestion-de-requisiciones', component: RequisicionesComponent},
        {path: 'gestion-de-puertos', component: PuertosComponent},
        {path: 'gestion-direcciones-envio', component: DireccionesEnvioComponent},                    
        {path: 'catalogo-de-proveedores', component: CatalogoProveedoresComponent},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
