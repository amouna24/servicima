import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseNormalComponent } from './expense-normal/expense-normal.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';

const routes: Routes = [
  {
    path: 'expense-add',
    component: ExpenseNormalComponent,
    data: {
      breadcrumb: 'Add new expense',
    }
  },
  {
    path: '',
    component: ExpensesListComponent,
    data: {
      breadcrumb: 'expenses list',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NormalRoutingModule { }
