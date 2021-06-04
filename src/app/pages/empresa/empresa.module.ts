//COMPONENTES DE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

// MODULOS DEL PROYECTO
import { PipesModule } from 'src/app/pipes/pipes.module';

//RUTAS DEL MODULO
import { EmpresaRoutingModule } from "./empresa-routing.module";

// COMPONENTES DE PRIMENG
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';

// COMPONENTES DEL MODULO DE COMPRAS
import { EmpresaComponent } from './empresa/empresa.component';
import { FormularioEmpresaComponent } from './empresa/formulario-empresa/formulario-empresa.component';
import { FormularioMonedasComponent } from './monedas/formulario-monedas/formulario-monedas.component';
import { MonedasComponent } from './monedas/monedas.component';
import { FormularioTipoClientesComponent } from './tipo-clientes/formulario-tipo-clientes/formulario-tipo-clientes.component';
import { TipoClientesComponent } from './tipo-clientes/tipo-clientes.component';
import { FormularioTipoDocumentosComponent } from './tipo-documentos/formulario-tipo-documentos/formulario-tipo-documentos.component';
import { TipoDocumentosComponent } from './tipo-documentos/tipo-documentos.component';
import { FormularioTiponegocioComponent } from './tipo-negocio/formulario-tiponegocio/formulario-tiponegocio.component';
import { TipoNegocioComponent } from './tipo-negocio/tipo-negocio.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { ZonasComponent } from './zonas/zonas.component';
import { FormularioZonasComponent } from './zonas/formulario-zonas/formulario-zonas.component';

@NgModule({
  declarations: [
    TipoNegocioComponent,
    FormularioTiponegocioComponent,
    EmpresaComponent,
    FormularioEmpresaComponent,
    TipoDocumentosComponent,
    FormularioTipoDocumentosComponent,
    TipoClientesComponent,
    FormularioTipoClientesComponent,
    MonedasComponent,
    FormularioMonedasComponent,
    ZonasComponent,
    FormularioZonasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    EmpresaRoutingModule,
    TableModule,
    PanelModule,
    ConfirmDialogModule,
    ToastModule,
    TabViewModule,
    MultiSelectModule,
    ToolbarModule,
    DropdownModule,
    InputTextModule,
    PipesModule,
    InputMaskModule,
    InputTextareaModule,
    ProgressBarModule
  ],
  exports:[
    FormularioTiponegocioComponent,
    FormularioTipoClientesComponent
  ],
  entryComponents: [
    FormularioEmpresaComponent
  ]
})
export class EmpresaModule { }
