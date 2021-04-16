import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HrRecordsComponent } from './hr-records.component';

const routes: Routes = [
  {
    path: '',
    component: HrRecordsComponent,
    data: {
      breadcrumb: 'test'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRecordsRoutingModule { }
