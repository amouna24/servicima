import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrainingComponent } from './training.component';
import { InvitationListComponent } from './invitation-list/invitation-list.component';
import { TrainingRequestCollaboratorComponent } from './training-request-collaborator/training-request-collaborator.component';
import { AddRequestTrainingComponent } from './add-request-training/add-request-training.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingComponent,
  },
  {
    path: 'invitation-list',
    component: InvitationListComponent,
  },
  {
    path: 'request-list',
    component: TrainingRequestCollaboratorComponent,
  },
  {
    path: 'add-request',
    component: AddRequestTrainingComponent,
  },
  {
    path: 'update-request',
    component: AddRequestTrainingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
