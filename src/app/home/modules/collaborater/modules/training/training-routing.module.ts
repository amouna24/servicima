import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrainingComponent } from './training.component';
import { InvitationListComponent } from './invitation-list/invitation-list.component';
import { TrainingRequestCollaboratorComponent } from './training-request-collaborator/training-request-collaborator.component';
import { AddRequestTrainingComponent } from './add-request-training/add-request-training.component';
import { TrainingAvailableListComponent } from './training-available-list/training-available-list.component';

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
  },
  {
    path: 'available-list',
    component: TrainingAvailableListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
