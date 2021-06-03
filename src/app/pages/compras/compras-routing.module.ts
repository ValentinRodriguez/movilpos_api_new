import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//COMPONENTES DEL PROYECTO
import { DireccionesEnvioComponent } from './mantenimiento/direcciones-envio/direcciones-envio.component';
import { FormularioDireccionesComponent } from './mantenimiento/direcciones-envio/formulario-direcciones/formulario-direcciones.component';
import { OrdenesComprasComponent } from './mantenimiento/ordenes-compras/ordenes-compras.component';
import { FormularioProveedoresComponent } from './mantenimiento/proveedores/formulario-proveedores/formulario-proveedores.component';
import { ProveedoresComponent } from './mantenimiento/proveedores/proveedores.component';
import { FormularioPuertosComponent } from './mantenimiento/puertos/formulario-puertos/formulario-puertos.component';
import { PuertosComponent } from './mantenimiento/puertos/puertos.component';
import { RequisicionesComponent } from './mantenimiento/requisiciones/requisiciones.component';
import { CatalogoProveedoresComponent } from './reportes/catalogo-proveedores/catalogo-proveedores.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: '', component: OrdenesComprasComponent, children:[
          {path:'', redirectTo: 'puertos', pathMatch: 'full'},
          {path: 'puertos', component: FormularioPuertosComponent},
          {path: 'direcciones', component: FormularioDireccionesComponent},
          {path: 'proveedores', component: FormularioProveedoresComponent},
        ]},
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
