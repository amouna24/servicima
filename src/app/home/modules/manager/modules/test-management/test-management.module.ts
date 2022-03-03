import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { TestManagementRoutingModule } from './test-management-routing.module';
import { BlocListComponent } from './bloc-list/bloc-list.component';
import { BlocListModalComponent } from './bloc-list-modal/bloc-list-modal.component';
import { SessionInfoComponent } from './session-info/session-info.component';

@NgModule({
  declarations: [BlocListComponent, BlocListModalComponent, SessionInfoComponent],
  imports: [
    CommonModule,
    TestManagementRoutingModule,
    SharedModule
  ]
})
export class TestManagementModule { }
