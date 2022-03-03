import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ChartsModule } from 'ng2-charts';

import { TestManagementRoutingModule } from './test-management-routing.module';
import { BlocListComponent } from './bloc-list/bloc-list.component';
import { BlocListModalComponent } from './bloc-list-modal/bloc-list-modal.component';
import { CustomizeSessionComponent } from './customize-session/customize-session.component';
import { LevelBlocComponent } from './customize-session/level-bloc/level-bloc.component';

@NgModule({
  declarations: [BlocListComponent, BlocListModalComponent, CustomizeSessionComponent, LevelBlocComponent],
  imports: [
    CommonModule,
    TestManagementRoutingModule,
    SharedModule,
    ChartsModule  ]
})
export class TestManagementModule { }
