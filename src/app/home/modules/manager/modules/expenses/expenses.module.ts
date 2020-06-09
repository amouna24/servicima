import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses.component';

@NgModule({
  declarations: [ExpensesComponent],
  imports: [
    CommonModule,
    ExpensesRoutingModule
  ]
})
export class ExpensesModule { }
