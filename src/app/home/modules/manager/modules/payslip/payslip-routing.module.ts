import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayslipListComponent } from './payslip-list/payslip-list.component';

const routes: Routes = [
  {
    path: '',
    component: PayslipListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayslipRoutingModule { }
