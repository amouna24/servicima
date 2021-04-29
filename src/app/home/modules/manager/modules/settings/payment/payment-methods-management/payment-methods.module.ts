import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';

@NgModule({
  declarations: [
  AddPaymentMethodComponent],
  imports: [
    CommonModule,
    SharedModule,
    PaymentMethodsRoutingModule,
    DynamicDataTableModule
  ],
})
export class PaymentMethodsModule {
}
