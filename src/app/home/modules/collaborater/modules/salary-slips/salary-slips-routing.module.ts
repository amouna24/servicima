import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SalarySlipsComponent } from './salary-slips.component';

const routes: Routes = [
  {
    path: '',
    component: SalarySlipsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalarySlipsRoutingModule { }
