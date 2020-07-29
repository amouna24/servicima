import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExpensesComponent } from './expenses.component';

const routes: Routes = [
  {
    path: '',
    component: ExpensesComponent,
    data: {
      breadcrumb: 'expenses'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
