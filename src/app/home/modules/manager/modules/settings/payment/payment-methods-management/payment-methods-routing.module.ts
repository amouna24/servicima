import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaymentInfoComponent } from '../payment-info/payment-info.component';
import { PaymentMethodsManagementComponent } from './payment-methods-management.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodsManagementComponent,
    data: {
      breadcrumb: 'payment methods'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentMethodsRoutingModule { }
