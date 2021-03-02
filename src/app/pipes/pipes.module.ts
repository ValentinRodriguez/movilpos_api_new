import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvProductosPipe } from './inv-productos.pipe';
import { GroupsumPipe } from './groupsum.pipe';
import { UsuarioPipe } from './usuario.pipe';
import { LogoPipe } from './logo.pipe';

@NgModule({
  declarations: [
    InvProductosPipe,
    GroupsumPipe,
    UsuarioPipe,
    LogoPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    InvProductosPipe,
    GroupsumPipe,
    UsuarioPipe,
    LogoPipe
  ]
})
export class PipesModule { }
