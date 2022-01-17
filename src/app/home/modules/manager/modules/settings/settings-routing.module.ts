import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dash',
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
    loadChildren: () => import('./timesheet settings/timesheet-settings.module').then(m => m.TimesheetSettingsModule),
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
    path: 'company-banking-info',
    loadChildren: () => import('./company-banking-info/companyBankingInfo.module').then(m => m.CompanyBankingInfoModule),
    data: {
      breadcrumb: 'company banking informations'
    },
  },

  {
    path: 'role',
    loadChildren: () => import('./role-management/role-management.module').then(m => m.RoleManagementModule),
    data: {
      breadcrumb: 'role'
    },
  },

  {
    path: 'departments',
    loadChildren: () => import('./departments/departments.module').then(m => m.DepartmentsModule),
    data: {
      breadcrumb: 'department'
    },
  },

  {
    path: 'calendars',
    loadChildren: () => import('./calendars/calendars.module').then(m => m.CalendarsModule),
    data: {
      breadcrumb: 'calendar'
    },
  },
  {
    path: '',
    loadChildren: () => import('./test-management/test-management.module').then(m => m.TestManagementModule),
    data: {
      breadcrumb: 'Test'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
