import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { NormalRoutingModule } from './normal-routing.module';
import { ExpenseNormalComponent } from './expense-normal/expense-normal.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { RecurringModule } from '../recurring/recurring.module';

@NgModule({
  declarations: [ExpenseNormalComponent, ExpensesListComponent],
  imports: [
    CommonModule,
    NormalRoutingModule,
    SharedModule,
    DynamicDataTableModule,
    RecurringModule,
  ]
})
export class NormalModule { }
