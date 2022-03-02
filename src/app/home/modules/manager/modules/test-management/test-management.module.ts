import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { TestManagementRoutingModule } from './test-management-routing.module';
import { BlocListComponent } from './bloc-list/bloc-list.component';
import { BlocListModalComponent } from './bloc-list-modal/bloc-list-modal.component';

@NgModule({
  declarations: [BlocListComponent, BlocListModalComponent],
  imports: [
    CommonModule,
    TestManagementRoutingModule,
    SharedModule
  ]
})
export class TestManagementModule { }
