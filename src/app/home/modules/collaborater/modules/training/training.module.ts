import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { InvitationListComponent } from './invitation-list/invitation-list.component';
import { InvitationComponent } from './invitation/invitation.component';
import { DetailsInvitationComponent } from './details-invitation/details-invitation.component';

@NgModule({
  declarations: [TrainingComponent, InvitationListComponent, InvitationComponent, DetailsInvitationComponent],
  imports: [
    CommonModule,
    SharedModule,
    TrainingRoutingModule
  ]
})
export class TrainingModule { }
