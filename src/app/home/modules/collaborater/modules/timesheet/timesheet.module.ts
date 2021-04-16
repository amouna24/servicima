import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetComponent } from './timesheet.component';
import { TimesheetsListComponent } from './timesheets-list/timesheets-list.component';
import { ContractManagementModule } from '../../../manager/modules/contract-management/contract-management.module';
import { AddTimesheetComponent } from './add-timesheet/add-timesheet.component';

@NgModule({
  declarations: [TimesheetComponent, TimesheetsListComponent, AddTimesheetComponent],
  imports: [
    CommonModule,
    TimesheetRoutingModule,
    SharedModule,
    ContractManagementModule,
  ]
})
export class TimesheetModule { }
