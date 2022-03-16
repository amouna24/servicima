import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestQcmComponent } from './test-qcm/test-qcm.component';

const routes: Routes = [
  {
    path: '',
    component: TestQcmComponent,
    data: {
      breadcrumb: 'QCM'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestManagementRoutingModule { }
