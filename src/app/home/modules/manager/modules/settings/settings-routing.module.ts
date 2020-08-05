import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersListComponent } from './usersList/users-list.component';
import { HomeCompanyComponent } from './home-company/home-company.component';
import { CompleteUpgradeLicenceComponent } from './complete-upgrade-licence/complete-upgrade-licence.component';
import { UpdateLicenceComponent } from './upgrade-licence/upgrade-licence.component';
import { BuyLicenceComponent } from './buy-licence/buy-licence.component';

const routes: Routes = [
  {
    path: 'users-list',
    component: UsersListComponent,
    data: {
      breadcrumb: 'users'
    },
  },
  {
    path: 'home-company',
    component: HomeCompanyComponent,
    data: {
      breadcrumb: 'company'
    },
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
    component: UpdateLicenceComponent,
    data: {
      breadcrumb: 'upgrade licence'
    },
  },
  {
    path: 'buy-licence',
    component: BuyLicenceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
