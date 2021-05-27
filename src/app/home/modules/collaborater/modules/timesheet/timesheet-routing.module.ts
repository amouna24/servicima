import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimesheetsListComponent } from './timesheets-list/timesheets-list.component';
import { AddTimesheetComponent } from './add-timesheet/add-timesheet.component';

const routes: Routes = [
  {
    path: '',
    component: TimesheetsListComponent,
    data: {
      breadcrumb: 'Timesheet'
    },
  },

  {
    path: 'add-timesheet',
    component: AddTimesheetComponent,
    data: {
      breadcrumb: 'add-timesheet'
    },
  },

  {
    path: 'add-timesheet-extra',
    component: AddTimesheetComponent,
    data: {
      breadcrumb: 'add-timesheet-extra'
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }
