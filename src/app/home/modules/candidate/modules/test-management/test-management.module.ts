import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { TestManagementRoutingModule } from './test-management-routing.module';
import { TestQcmComponent } from './test-qcm/test-qcm.component';

@NgModule({
  declarations: [ TestQcmComponent ],
  imports: [
    CommonModule,
    TestManagementRoutingModule,
    SharedModule
  ]
})
export class TestManagementModule { }
