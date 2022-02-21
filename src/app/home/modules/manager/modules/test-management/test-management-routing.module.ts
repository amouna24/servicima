import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlocListComponent } from './bloc-list/bloc-list.component';

const routes: Routes = [
  {
    path: 'bloc-list',
    component: BlocListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestManagementRoutingModule { }
