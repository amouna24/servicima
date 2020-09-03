import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { LicenceRoutingModule } from './licence-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LicenceRoutingModule,
    SharedModule,
    DataTableModule,
  ]
})
export class LicenceModule { }
