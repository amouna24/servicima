import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaxComponent } from './tax.component';

const routes: Routes = [
  {
    path: 'tax',
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
