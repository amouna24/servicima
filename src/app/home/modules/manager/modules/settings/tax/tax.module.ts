import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { TaxRoutingModule } from './tax-routing.module';
import { TaxComponent } from './tax.component';

@NgModule({
  declarations: [
    TaxComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TaxRoutingModule,
    DataTableModule,
  ],
})
export class TaxModule {
}
