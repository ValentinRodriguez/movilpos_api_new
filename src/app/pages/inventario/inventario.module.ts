//COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

// MODULOS DEL PROYECTO
import { PipesModule } from 'src/app/pipes/pipes.module';

// RUTAS DEL MODULO
import { InventarioRoutingModule } from "./inventario-routing.module";

// COMPONENTES DE PRIMENG
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { PickListModule } from 'primeng/picklist';
import { FieldsetModule } from 'primeng/fieldset';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PanelModule } from 'primeng/panel';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import {SelectButtonModule} from 'primeng/selectbutton';
import { StepsModule } from 'primeng/steps';
import {AccordionModule} from 'primeng/accordion';
// COMPONENTES DEL MODULO DE COMPRAS
import { BodegasComponent } from './mantenimiento/bodegas/bodegas.component';
import { FormularioBodegasComponent } from './mantenimiento/bodegas/formulario-bodegas/formulario-bodegas.component';
import { BodegasPermisosComponent } from './mantenimiento/bodegas/bodegas-permisos/bodegas-permisos.component';
import { CategoriasComponent } from './mantenimiento/categorias/categorias.component';
import { FormularioCatComponent } from "./mantenimiento/categorias/formulario-cat/formulario-cat.component";
import { FormularioMaestraProductosComponent } from './mantenimiento/maestra-productos/formulario-maestra-productos/formulario-maestra-productos.component';
import { MaestraProductosComponent } from './mantenimiento/maestra-productos/maestra-productos.component';
import { MarcasComponent } from './mantenimiento/marcas/marcas.component';
import { FormularioMarcaComponent } from './mantenimiento/marcas/formulario-marca/formulario-marca.component';
import { PropiedadesComponent } from './mantenimiento/propiedades/propiedades.component';
import { FormularioPropiedadesComponent } from './mantenimiento/propiedades/formulario-propiedades/formulario-propiedades.component';
import { FormularioTipoinvComponent } from './mantenimiento/tipos-inventarios/formulario-tipoinv/formulario-tipoinv.component';
import { TiposInventariosComponent } from './mantenimiento/tipos-inventarios/tipos-inventarios.component';
import { FormularioTipoMovComponent } from './mantenimiento/tipos-movimientos/formulario-tipo-mov/formulario-tipo-mov.component';
import { MovimientoPermisosComponent } from './mantenimiento/tipos-movimientos/movimiento-permisos/movimiento-permisos.component';
import { StepTipoMovComponent } from './mantenimiento/tipos-movimientos/step-tipo-mov/step-tipo-mov.component';
import { TiposMovimientosComponent } from './mantenimiento/tipos-movimientos/tipos-movimientos.component';
import { FormularioInvTransaccionesComponent } from './mantenimiento/transacciones-inventario/formulario-inv-transacciones/formulario-inv-transacciones.component';
import { StepTransaccionesComponent } from './mantenimiento/transacciones-inventario/step-transacciones/step-transacciones.component';
import { TransaccionesInventarioComponent } from './mantenimiento/transacciones-inventario/transacciones-inventario.component';
import { FormularioTransportistaComponent } from './mantenimiento/transportistas/formulario-transportista/formulario-transportista.component';
import { StepTransportistasComponent } from './mantenimiento/transportistas/step-transportistas/step-transportistas.component';
import { TransportistasComponent } from './mantenimiento/transportistas/transportistas.component';
import { ExistenciasAlmacenesComponent } from './mantenimiento/existencias-almacenes/existencias-almacenes.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ProgressBarModule } from 'primeng/progressbar';
import { LiquidacionMercanciasComponent } from './mantenimiento/liquidacion-mercancias/liquidacion-mercancias.component';
import { FormularioLiquidacionMercanciasComponent } from './mantenimiento/liquidacion-mercancias/formulario-liquidacion-mercancias/formulario-liquidacion-mercancias.component';
import { CostoStandardComponent } from './mantenimiento/costo-standard/costo-standard.component';
import { FormularioCostoStandardComponent } from './mantenimiento/costo-standard/formulario-costo-standard/formulario-costo-standard.component';
import { FileUploadModule } from 'primeng/fileupload';
import {RatingModule} from 'primeng/rating';

@NgModule({
  declarations: [
    BodegasComponent,
    FormularioBodegasComponent,
    BodegasPermisosComponent,
    CategoriasComponent,
    FormularioCatComponent,
    MaestraProductosComponent,
    FormularioMaestraProductosComponent,
    MarcasComponent,
    FormularioMarcaComponent,
    PropiedadesComponent,
    FormularioPropiedadesComponent,
    TiposInventariosComponent,
    FormularioTipoinvComponent,
    TiposMovimientosComponent,
    StepTipoMovComponent,
    MovimientoPermisosComponent,
    FormularioTipoMovComponent,
    TransaccionesInventarioComponent,
    StepTransaccionesComponent,
    TransportistasComponent,
    StepTransportistasComponent,
    FormularioInvTransaccionesComponent,
    FormularioTransportistaComponent,
    ExistenciasAlmacenesComponent,
    LiquidacionMercanciasComponent,
    FormularioLiquidacionMercanciasComponent,
    CostoStandardComponent,
    FormularioCostoStandardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RatingModule,
    InventarioRoutingModule,
    DropdownModule,
    TableModule,
    AccordionModule,
    ComponentsModule,
    ConfirmDialogModule,
    FileUploadModule,
    StepsModule,
    ToastModule,
    TabViewModule,
    ToolbarModule,
    PickListModule,
    FieldsetModule,
    AutoCompleteModule,
    PanelModule,
    InputMaskModule,
    SelectButtonModule,
    DialogModule,
    InputNumberModule,
    CalendarModule,
    InputTextModule,
    InputTextareaModule,
    PipesModule,
    CheckboxModule,
    ComponentsModule,
    ProgressBarModule
  ],
  entryComponents: [
    BodegasPermisosComponent,
    MovimientoPermisosComponent,
    StepTransaccionesComponent,
    FormularioTransportistaComponent,
    StepTransportistasComponent
  ]
})
export class InventarioModule { }
