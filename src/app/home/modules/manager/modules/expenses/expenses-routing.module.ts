import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExpenseDashbordComponent } from './expense-dashbord/expense-dashbord.component';
import { AddBankStatementComponent } from './bank-statement/add-bank-statement/add-bank-statement.component';
import { ListBankStatementComponent } from './bank-statement/list-bank-statement/list-bank-statement.component';

const routes: Routes = [
  {
    path: 'expenses-normal',
    loadChildren: () => import('./normal/normal.module').then(m => m.NormalModule),
  },
  {
    path: 'expenses-recurring',
    loadChildren: () => import('./recurring/recurring.module').then(m => m.RecurringModule),

  },
  {
    path: 'add-bank-statement',
    component: AddBankStatementComponent,

  },
  {
    path: 'list-bank-statement',
    component: ListBankStatementComponent,

  },
  {
    path: '',
    component: ExpenseDashbordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
