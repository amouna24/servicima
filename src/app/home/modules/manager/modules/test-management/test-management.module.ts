import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { CoreModule } from '@core/core.module';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';

import { TestManagementRoutingModule } from './test-management-routing.module';
import { BlocListComponent } from './bloc-list/bloc-list.component';
import { BlocListModalComponent } from './bloc-list-modal/bloc-list-modal.component';
import { SessionInfoComponent } from './session-info/session-info.component';
import { CustomizeSessionComponent } from './customize-session/customize-session.component';
import { LevelBlocComponent } from './customize-session/level-bloc/level-bloc.component';
import { SessionTimerComponent } from './session-timer/session-timer.component';
import { OverallTimerDialogComponent } from './session-timer/overall-timer-dialog/overall-timer-dialog.component';
import { SessionListComponent } from './session-list/session-list.component';

@NgModule({
  declarations: [
    BlocListComponent,
    BlocListModalComponent,
    CustomizeSessionComponent,
    LevelBlocComponent,
    SessionInfoComponent,
    SessionTimerComponent,
    OverallTimerDialogComponent,
    SessionListComponent],
    imports: [
        CommonModule,
        TestManagementRoutingModule,
        SharedModule,
        ChartsModule,
        CoreModule,
        DynamicDataTableModule
    ]
})
export class TestManagementModule { }
