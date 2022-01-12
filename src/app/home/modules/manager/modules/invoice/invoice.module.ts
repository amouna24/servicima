import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceManagementComponent } from './invoice-management/invoice-management.component';
import { ListInvoicesComponent } from './list-invoices/list-invoices.component';
import { PaymentInvoiceComponent } from './payment-invoice/payment-invoice.component';
import { ListImportInvoiceComponent } from './list-import-invoice/list-import-invoice.component';

@NgModule({
  declarations: [InvoiceManagementComponent, ListInvoicesComponent,
                 PaymentInvoiceComponent, ListImportInvoiceComponent],
  imports: [
    CommonModule,
    SharedModule,
    InvoiceRoutingModule,
    DynamicDataTableModule,
  ]
})
export class InvoiceModule { }
