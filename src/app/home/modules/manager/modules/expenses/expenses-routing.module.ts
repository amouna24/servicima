import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExpenseDashbordComponent } from './expense-dashbord/expense-dashbord.component';

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
    path: '',
    component: ExpenseDashbordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
