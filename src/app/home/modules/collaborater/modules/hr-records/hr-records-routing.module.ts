import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrRecordsComponent } from './hr-records.component';


const routes: Routes = [
  {
    path: '',
    component: HrRecordsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRecordsRoutingModule { }
