import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaymentInfoComponent } from './payment-info-company-management/payment-info.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentInfoRoutingModule { }
