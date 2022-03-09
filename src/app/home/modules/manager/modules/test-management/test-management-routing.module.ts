import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlocListComponent } from './bloc-list/bloc-list.component';
import { CustomizeSessionComponent } from './customize-session/customize-session.component';
import { SessionInfoComponent } from './session-info/session-info.component';
import { SessionTimerComponent } from './session-timer/session-timer.component';
import { SessionListComponent } from './session-list/session-list.component';

const routes: Routes = [
  {
    path: 'bloc-list',
    component: BlocListComponent
  },

  {
    path: 'session-info',
    component: SessionInfoComponent
  },
  {
    path: 'customize-session',
    component: CustomizeSessionComponent
  },
  {
    path: 'session-timer',
    component: SessionTimerComponent
  },
  {
    path: 'session-list',
    component: SessionListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestManagementRoutingModule { }
