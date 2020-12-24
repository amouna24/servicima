import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    PaymentMethodsRoutingModule,
    DataTableModule,
  ],
})
export class PaymentMethodsModule {
}
