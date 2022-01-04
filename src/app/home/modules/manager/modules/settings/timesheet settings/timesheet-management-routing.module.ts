import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimesheetSettingsComponent } from './timesheet-settings.component';

const routes: Routes = [

  {
    path: '',
    component: TimesheetSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetManagementRoutingModule { }
