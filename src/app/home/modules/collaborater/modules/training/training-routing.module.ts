import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrainingComponent } from './training.component';
import { InvitationListComponent } from './invitation-list/invitation-list.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingComponent,
  },
  {
    path: 'invitation-list',
    component: InvitationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
