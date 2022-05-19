import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseRecurringComponent } from './expense-recurring/expense-recurring.component';
import { ExpenseRecurringListComponent } from './expense-recurring-list/expense-recurring-list.component';

const routes: Routes = [
  {
    path: 'expense-add-recurring',
    component: ExpenseRecurringComponent,
    data: {
      breadcrumb: 'Add new recurring expense',
    }
  },
  {
    path: '',
    component: ExpenseRecurringListComponent,
    data: {
      breadcrumb: 'recurring expenses list',
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecurringRoutingModule { }
