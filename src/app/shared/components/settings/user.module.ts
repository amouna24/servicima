import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    DynamicDataTableModule
  ]
})
export class UserModule { }
