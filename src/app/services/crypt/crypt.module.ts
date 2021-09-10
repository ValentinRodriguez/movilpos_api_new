import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalService } from './local.service';
import { StorageService } from './storage.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    LocalService,
    StorageService

  ]
})
export class CryptModule { }
