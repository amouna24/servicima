import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlocListComponent } from './bloc-list/bloc-list.component';
import { CustomizeSessionComponent } from './customize-session/customize-session.component';

const routes: Routes = [
  {
    path: 'bloc-list',
    component: BlocListComponent
  },
  {
    path: 'customize-session',
    component: CustomizeSessionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestManagementRoutingModule { }
