import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacementComponent } from './placement.component';


const routes: Routes = [
  {
    path: '',
    component: PlacementComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementRoutingModule { }
