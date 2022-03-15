import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestManagementRoutingModule } from './test-management-routing.module';
import { TestQcmComponent } from './test-qcm/test-qcm.component';
import { WelcomeToTestComponent } from './welcome-to-test/welcome-to-test.component';
import { SharedModule } from '@shared/shared.module';

import { TestCongratulationsComponent } from './test-congratulations/test-congratulations.component';
import { DialogInviteComponent } from './dialog-invite/dialog-invite.component';

@NgModule({
  declarations: [ TestQcmComponent, WelcomeToTestComponent, TestCongratulationsComponent, DialogInviteComponent ],
  imports: [
    CommonModule,
    TestManagementRoutingModule,
    SharedModule
  ]
})
export class TestManagementModule { }
