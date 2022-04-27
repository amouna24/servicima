import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { InvitationListComponent } from './invitation-list/invitation-list.component';
import { InvitationComponent } from './invitation/invitation.component';
import { DetailsInvitationComponent } from './details-invitation/details-invitation.component';
import { TrainingRequestCollaboratorComponent } from './training-request-collaborator/training-request-collaborator.component';
import { HumanRessourcesModule } from '../../../manager/modules/human-ressources/human-ressources.module';
import { AddRequestTrainingComponent } from './add-request-training/add-request-training.component';
import { TrainingAvailableListComponent } from './training-available-list/training-available-list.component';
import { TrainingAvailableComponent } from './training-available/training-available.component';

@NgModule({
  declarations: [
      TrainingComponent,
      InvitationListComponent,
      InvitationComponent,
      DetailsInvitationComponent,
      TrainingRequestCollaboratorComponent, AddRequestTrainingComponent, TrainingAvailableListComponent, TrainingAvailableComponent],
    imports: [
        CommonModule,
        SharedModule,
        TrainingRoutingModule,
        HumanRessourcesModule,
    ]
})
export class TrainingModule { }
