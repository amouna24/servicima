import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimesheetsListComponent } from './timesheets-list/timesheets-list.component';

const routes: Routes = [
  {
    path: '',
    component: TimesheetsListComponent,
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
