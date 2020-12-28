import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { PaymentInfoRoutingModule } from './payment-info-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    PaymentInfoRoutingModule,
    DataTableModule,
  ],
})
export class PaymentInfoModule {
}
