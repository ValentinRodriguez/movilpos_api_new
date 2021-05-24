import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

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
        {path: 'gestion-factura-proveedores', component: FacturasProveedoresComponent},
       ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class CuentasPagarRoutingModule { }
