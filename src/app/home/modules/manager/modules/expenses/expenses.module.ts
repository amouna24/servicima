import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses.component';
import { ExpenseDashbordComponent } from './expense-dashbord/expense-dashbord.component';

@NgModule({
  declarations: [ExpensesComponent, ExpenseDashbordComponent],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    SharedModule,
    DynamicDataTableModule,
    NgxChartsModule
  ]
})
export class ExpensesModule { }
