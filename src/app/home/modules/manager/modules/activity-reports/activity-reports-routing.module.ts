import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActivityReportsComponent } from './activity-reports.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityReportsComponent,
    data: {
      breadcrumb: 'activity-reports'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityReportsRoutingModule { }
