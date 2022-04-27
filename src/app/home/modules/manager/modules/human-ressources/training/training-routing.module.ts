import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingAddComponent } from './training-add/training-add.component';
import { TrainingListComponent } from './training-list/training-list.component';
import { SessionsTrainingComponent } from './sessions-training/sessions-training.component';
import { ListRequestManagerComponent } from './list-request-manager/list-request-manager.component';

const routes: Routes = [
  {
    path: 'training-add',
    component: TrainingAddComponent
  },
  {
    path: 'training-update',
    component: TrainingAddComponent
  },
  {
    path: 'session-training',
    component: SessionsTrainingComponent
  },
  {
    path: 'session-training-update',
    component: SessionsTrainingComponent
  },
  {
    path: 'training-list',
    component: TrainingListComponent
  },
  {
    path: 'request-list',
    component: ListRequestManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
