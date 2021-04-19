import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LicenceManagementComponent } from './licence-management/licence-management.component';
import { CompleteUpgradeLicenceComponent } from './complete-upgrade-licence/complete-upgrade-licence.component';
import { UpgradeLicenceComponent } from './upgrade-licence/upgrade-licence.component';
import { BuyLicenceComponent } from './buy-licence/buy-licence.component';

const routes: Routes = [

  {
    path: '',
    component: LicenceManagementComponent,
  },

  {
    path: 'complete-update',
    component: CompleteUpgradeLicenceComponent,
    data: {
      breadcrumb: 'complete update'
    },
  },
  {
    path: 'upgrade-licence',
    component: UpgradeLicenceComponent,
    data: {
      breadcrumb: 'upgrade licence'
    },
  },
  {
    path: 'buy-licence',
    component: BuyLicenceComponent,
    data: {
      breadcrumb: 'buy licence'
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicenceRoutingModule { }
