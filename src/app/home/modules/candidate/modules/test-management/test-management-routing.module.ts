import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateGuardGuard } from '@core/guard/candidate-guard.guard';

import { WelcomeToTestComponent } from './welcome-to-test/welcome-to-test.component';
import { TestQcmComponent } from './test-qcm/test-qcm.component';

const routes: Routes = [
  {
  path: 'welcome-to-test',
  component: WelcomeToTestComponent
  },
  {
    path: 'qcm',
    component: TestQcmComponent,
    canActivate: [CandidateGuardGuard],
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
