import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { PaymentInfoRoutingModule } from './payment-info-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    DynamicDataTableModule,
    SharedModule,
    PaymentInfoRoutingModule,
  ],
})
export class PaymentInfoModule {
}
