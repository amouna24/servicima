import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliersRoutingModule } from './suppliers-routing.module';

@NgModule({
  declarations: [],
  imports: [
    SuppliersRoutingModule,
    CommonModule
  ],
  exports: [
    SuppliersRoutingModule,
  ]
})
export class SuppliersModuleModule { }
