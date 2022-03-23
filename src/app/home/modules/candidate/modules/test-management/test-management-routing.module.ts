import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeToTestComponent } from './welcome-to-test/welcome-to-test.component';
import { TestCongratulationsComponent } from './test-congratulations/test-congratulations.component';
import { TestQcmComponent } from './test-qcm/test-qcm.component';

const routes: Routes = [
  {
  path: 'welcome-to-test',
  component: WelcomeToTestComponent
  },
  {
    path: 'test-done',
    component: TestCongratulationsComponent
  },
  {
    path: 'qcm',
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
