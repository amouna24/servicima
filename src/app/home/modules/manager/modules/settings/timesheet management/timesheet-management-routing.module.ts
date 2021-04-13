import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimesheetManagementComponent } from './timesheet-management/timesheet-management.component';

const routes: Routes = [

  {
    path: '',
    component: TimesheetManagementComponent,
    data: {
      breadcrumb: 'role'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetManagementRoutingModule { }
