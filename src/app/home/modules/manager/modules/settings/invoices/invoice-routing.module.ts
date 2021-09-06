import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvoiceComponent } from './invoice-management/invoice.component';
import { ListInvoicesComponent } from './list-invoices/list-invoices.component';

const routes: Routes = [
  {
    path: 'add-invoice',
    component: InvoiceComponent,
  },
  {
    path: '',
    component: ListInvoicesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
