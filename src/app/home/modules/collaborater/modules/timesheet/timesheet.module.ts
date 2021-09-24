import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetComponent } from './timesheet.component';
import { TimesheetsListComponent } from './timesheets-list/timesheets-list.component';
import { ContractManagementModule } from '../../../manager/modules/contract-management/contract-management.module';
import { DynamicDataTableModule } from '../../../../../shared/modules/dynamic-data-table/dynamic-data-table.module';
import { AddEditTimesheetComponent } from './add-edit-timesheet/add-edit-timesheet.component';
@NgModule({
  declarations: [
    TimesheetComponent,
    TimesheetsListComponent,
    AddEditTimesheetComponent
  ],
  imports: [
    CommonModule,
    TimesheetRoutingModule,
    SharedModule,
    ContractManagementModule,
    DynamicDataTableModule,
  ]
})
export class TimesheetModule { }
