import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimesheetsListComponent } from './timesheets-list/timesheets-list.component';
import { AddEditTimesheetComponent } from './add-edit-timesheet/add-edit-timesheet.component';

const routes: Routes = [
  {
    path: ':type_timesheet',
    component: TimesheetsListComponent,
    data: {
      breadcrumb: 'Timesheet'
    },
  },

  {
    path: ':action/:type',
    component: AddEditTimesheetComponent,
    data: {
      breadcrumb: 'add-timesheet'
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }
