import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { TestManagementRoutingModule } from './test-management-routing.module';
import { TestQcmComponent } from './test-qcm/test-qcm.component';
import { WelcomeToTestComponent } from './welcome-to-test/welcome-to-test.component';
import { TestCongratulationsComponent } from './test-congratulations/test-congratulations.component';

@NgModule({
  declarations: [ TestQcmComponent, WelcomeToTestComponent, TestCongratulationsComponent ],
  imports: [
    CommonModule,
    TestManagementRoutingModule,
    SharedModule
  ]
})
export class TestManagementModule { }
