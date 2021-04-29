import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    data: {
      breadcrumb: ''
    },
  },
  {
    path: 'users',
    loadChildren: () => import('./usersList/users-list.module').then(m => m.UserListModule),
    data: {
      breadcrumb: 'users'
    },
  },

  {
    path: 'licences',
    loadChildren: () => import('./licence/licence.module').then(m => m.LicenceModule),
    data: {
      breadcrumb: 'licences'
    },
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./payment/payment-methods-management/payment-methods.module').then(m => m.PaymentMethodsModule),
    data: {
      breadcrumb: 'payment-methods'
    },
  },

  {
    path: 'timesheet-setting',
    loadChildren: () => import('./timesheet management/timesheet-management.module').then(m => m.TimesheetManagementModule),
    data: {
      breadcrumb: 'timesheet-setting'
    },
  },

  {
    path: 'payment-info',
    loadChildren: () => import('./payment/payment-info/payment-info.module').then(m => m.PaymentInfoModule),
    data: {
      breadcrumb: 'payment-info'
    },
  },

  {
    path: 'home-company',
    loadChildren: () => import('./home-company/homeCompany.module').then(m => m.HomeCompanyModule),
  },

  {
    path: 'tax',
    loadChildren: () => import('./tax/tax.module').then(m => m.TaxModule),
    data: {
      breadcrumb: 'tax'
    },
  },

  {
    path: 'invoices',
    loadChildren: () => import('./invoices/invoice.module').then(m => m.InvoiceModule),
    data: {
      breadcrumb: 'invoices'
    },
  },

  {
    path: 'role',
    loadChildren: () => import('./role-management/role-management.module').then(m => m.RoleManagementModule),
    data: {
      breadcrumb: 'role'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
