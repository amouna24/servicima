import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimesheetsListComponent } from './timesheets-list/timesheets-list.component';
import { TimesheetComponent } from './timesheet.component';

const routes: Routes = [
  {
    path: '',
    component: TimesheetComponent,
    data: {
      breadcrumb: 'Timesheet'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }
