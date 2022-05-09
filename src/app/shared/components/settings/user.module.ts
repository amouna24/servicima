import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';
import { ConnectionComponent } from '@shared/components/settings/connection/connection.component';

import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [ConnectionComponent],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    DynamicDataTableModule
  ]
})
export class UserModule { }
