import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

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
    DynamicDataTableModule,
  ],
})
export class TaxModule {
}
