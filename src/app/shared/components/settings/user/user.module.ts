import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@dataTable/data-table.module';

import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    DataTableModule,
  ]
})
export class UserModule { }
