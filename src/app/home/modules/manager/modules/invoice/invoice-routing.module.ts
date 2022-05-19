import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvoiceManagementComponent } from './invoice-management/invoice-management.component';
import { ListInvoicesComponent } from './list-invoices/list-invoices.component';

const routes: Routes = [
  {
    path: 'add-invoice',
    component: InvoiceManagementComponent,
  },
  {
    path: 'list',
    component: ListInvoicesComponent,
  },
  {
    path: ':status',
    component: ListInvoicesComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
