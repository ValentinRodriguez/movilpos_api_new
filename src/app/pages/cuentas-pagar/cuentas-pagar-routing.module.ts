import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GestionDocNcndComponent } from './mantenimiento/gestion-doc-ncnd/gestion-doc-ncnd.component';

//COMPONENTES DEL PROYECTO
import { FacturasProveedoresComponent } from './mantenimiento/facturas-proveedores/facturas-proveedores.component';
import { AnalisisSaldoComponent } from './reportes/analisis-saldo/analisis-saldo.component';

@NgModule({
  imports: [
    RouterModule.forChild([      
      {
       path: '',
       children: [
        {path: 'reporte-analisis-saldo', component: AnalisisSaldoComponent},                   
         { path: 'gestion-factura-proveedores', component: FacturasProveedoresComponent },
         {path: 'gestion-documentos-ndnc', component: GestionDocNcndComponent},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class CuentasPagarRoutingModule { }
