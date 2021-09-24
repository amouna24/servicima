import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { ShowTimesheetComponent } from './show-timesheet/show-timesheet.component';
import { RejectTimesheetComponent } from './reject-timesheet/reject-timesheet.component';
import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetComponent } from './timesheet.component';
import { ListTimesheetComponent } from './list-timesheet/list-timesheet.component';
import { EditTimesheetComponent } from './edit-timesheet/edit-timesheet.component';

@NgModule({
  declarations: [TimesheetComponent, ListTimesheetComponent, ShowTimesheetComponent, RejectTimesheetComponent, EditTimesheetComponent],
    imports: [
        CommonModule,
        TimesheetRoutingModule,
        MatIconModule,
        FlexModule,
        MatButtonModule,
        MatDividerModule,
        DynamicDataTableModule,
        MatFormFieldModule,
        MatInputModule,
        SharedModule,
    ]
})
export class TimesheetModule { }
