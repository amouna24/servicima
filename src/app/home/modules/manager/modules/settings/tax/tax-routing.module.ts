import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaxComponent } from './tax-company-management/tax.component';

const routes: Routes = [
  {
    path: '',
    component: TaxComponent,
    data: {
      breadcrumb: 'tax'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxRoutingModule { }
