import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { TestManagementRoutingModule } from './test-management-routing.module';
import { TestQcmComponent } from './test-qcm/test-qcm.component';
import { WelcomeToTestComponent } from './welcome-to-test/welcome-to-test.component';

@NgModule({
  declarations: [ TestQcmComponent, WelcomeToTestComponent ],
  imports: [
    CommonModule,
    TestManagementRoutingModule,
    SharedModule
  ]
})
export class TestManagementModule { }
