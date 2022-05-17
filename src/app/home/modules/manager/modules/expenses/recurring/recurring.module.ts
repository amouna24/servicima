import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { RecurringRoutingModule } from './recurring-routing.module';
import { ExpenseRecurringComponent } from './expense-recurring/expense-recurring.component';
import { ExpensesAddComponent } from '../expenses-add/expenses-add.component';
import { ExpenseRecurringListComponent } from './expense-recurring-list/expense-recurring-list.component';

@NgModule({
  declarations: [ExpenseRecurringComponent, ExpensesAddComponent, ExpenseRecurringListComponent],
  exports: [
    ExpensesAddComponent
  ],
  imports: [
    CommonModule,
    RecurringRoutingModule,
    SharedModule,
    DynamicDataTableModule,
  ]
})
export class RecurringModule { }
