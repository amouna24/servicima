import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DataTableModule } from '@dataTable/data-table.module';

import { TimesheetManagementRoutingModule } from './timesheet-management-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TimesheetManagementRoutingModule,
    SharedModule,
    DataTableModule,
  ]
})
export class TimesheetSettingsModule { }
