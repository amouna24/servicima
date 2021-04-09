import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./usersList/users-list.module').then(m => m.UserListModule),
  },

  {
    path: 'licences',
    loadChildren: () => import('./licence/licence.module').then(m => m.LicenceModule),
    data: {
      breadcrumb: 'settings'
    },
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./payment/payment-methods-management/payment-methods.module').then(m => m.PaymentMethodsModule),
    data: {
      breadcrumb: 'settings'
    },
  },

  {
    path: 'timesheet-setting',
    loadChildren: () => import('./timesheet management/timesheet-management.module').then(m => m.TimesheetManagementModule),
    data: {
      breadcrumb: 'settings'
    },
  },

  {
    path: 'payment-info',
    loadChildren: () => import('./payment/payment-info/payment-info.module').then(m => m.PaymentInfoModule),
    data: {
      breadcrumb: 'settings'
    },
  },

  {
    path: 'home-company',
    loadChildren: () => import('./home-company/homeCompany.module').then(m => m.HomeCompanyModule),
    data: {
      breadcrumb: 'company'
    },
  },

  {
    path: 'tax',
    loadChildren: () => import('./tax/tax.module').then(m => m.TaxModule),
    data: {
      breadcrumb: 'settings'
    },
  },

  {
    path: 'role',
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
