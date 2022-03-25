import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';
import { SharedModule } from '@shared/shared.module';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingAddComponent } from './training-add/training-add.component';
import { TrainingListComponent } from './training-list/training-list.component';
import { SessionsTrainingComponent } from './sessions-training/sessions-training.component';
import { TrainingDoneCreatedComponent } from './training-done-created/training-done-created.component';

@NgModule({
  declarations: [TrainingAddComponent, TrainingListComponent, SessionsTrainingComponent, TrainingDoneCreatedComponent],
    imports: [
        CommonModule,
        TrainingRoutingModule,
        DynamicDataTableModule,
        SharedModule,

    ]
})
export class TrainingModule { }
