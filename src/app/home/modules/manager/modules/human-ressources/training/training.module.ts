import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDataTableModule } from '@shared/modules/dynamic-data-table/dynamic-data-table.module';
import { SharedModule } from '@shared/shared.module';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingAddComponent } from './training-add/training-add.component';
import { TrainingListComponent } from './training-list/training-list.component';
import { SessionsTrainingComponent } from './sessions-training/sessions-training.component';
import { InviteCollaboratorComponent } from './invite-collaborator/invite-collaborator.component';
import { ListRequestManagerComponent } from './list-request-manager/list-request-manager.component';
import { ListRequestTrainingComponent } from './list-request-training/list-request-training.component';
import { ShowTrainingRequestComponent } from './show-training-request/show-training-request.component';

@NgModule({
    declarations: [
        TrainingAddComponent,
        TrainingListComponent,
        SessionsTrainingComponent,
        InviteCollaboratorComponent,
        ListRequestManagerComponent,
        ListRequestTrainingComponent,
        ShowTrainingRequestComponent],
    exports: [
        ListRequestTrainingComponent
    ],
    imports: [
        CommonModule,
        TrainingRoutingModule,
        DynamicDataTableModule,
        SharedModule,

    ]
})
export class TrainingModule { }
