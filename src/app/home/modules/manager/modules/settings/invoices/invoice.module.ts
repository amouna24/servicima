import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { ListInvoicesComponent } from './list-invoices/list-invoices.component';

@NgModule({
  declarations: [
  ListInvoicesComponent],
  imports: [
    CommonModule,
    SharedModule,
    InvoiceRoutingModule,
    DynamicDataTableModule,
  ],
})
export class InvoiceModule {
}
