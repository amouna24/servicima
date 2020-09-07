import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./usersList/users-list.module').then(m => m.UserListModule),
    data: {
      breadcrumb: 'settings'
    },
  },

  {
    path: 'licence',
    loadChildren: () => import('./licence/licence.module').then(m => m.LicenceModule),
    data: {
      breadcrumb: 'settings'
    },
  },

  {
    path: '',
    loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
    data: {
      breadcrumb: 'settings'
    },
  },

  {
    path: '',
    loadChildren: () => import('./home-company/homeCompany.module').then(m => m.HomeCompanyModule),
    data: {
      breadcrumb: 'settings'
    },
  },

  {
    path: '',
    loadChildren: () => import('./tax/tax.module').then(m => m.TaxModule),
    data: {
      breadcrumb: 'settings'
    },
  },

  {
    path: '',
    loadChildren: () => import('./role-management/role-management.module').then(m => m.RoleManagementModule),
    data: {
      breadcrumb: 'settings'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
