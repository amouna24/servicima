import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnnualInterviewsComponent } from './annual-interviews.component';

const routes: Routes = [
  {
    path: '',
    component: AnnualInterviewsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnualInterviewsRoutingModule { }
