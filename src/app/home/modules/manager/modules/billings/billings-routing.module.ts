import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BillingsComponent } from './billings.component';

const routes: Routes = [
  {
    path: '',
    component: BillingsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingsRoutingModule { }
