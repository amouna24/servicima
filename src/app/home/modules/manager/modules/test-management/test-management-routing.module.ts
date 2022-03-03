import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlocListComponent } from './bloc-list/bloc-list.component';
import { SessionInfoComponent } from './session-info/session-info.component';

const routes: Routes = [
  {
    path: 'bloc-list',
    component: BlocListComponent
  },

  {
    path: 'session-info',
    component: SessionInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestManagementRoutingModule { }
