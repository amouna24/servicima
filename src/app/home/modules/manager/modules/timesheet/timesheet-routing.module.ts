import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListTimesheetComponent } from './list-timesheet/list-timesheet.component';
import { EditTimesheetComponent } from './edit-timesheet/edit-timesheet.component';

const routes: Routes = [
  {
    path: ':status',
    component: ListTimesheetComponent,
    data: {
      breadcrumb: 'Timesheet'
    },
  },
  {
    path: 'edit/:type',
    component: EditTimesheetComponent,
    data: {
      breadcrumb: 'Edit Timesheet'
    },
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }
