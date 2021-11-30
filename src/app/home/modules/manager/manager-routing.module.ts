import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagerComponent } from './manager.component';
import { ShareOnLinkedinComponent } from './modules/share-on-linkedin/share-on-linkedin.component';

const routes: Routes = [
  {
    path: '',
    component: ManagerComponent,
    children: [
      {
        path: 'timesheet',
        loadChildren: () => import('./modules/timesheet/timesheet.module').then(m => m.TimesheetModule),
      },
      {
        path: 'payslip',
        loadChildren: () => import('./modules/payslip/payslip.module').then(m => m.PayslipModule),
      },
      {
        path: '',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'activity-reports',
        loadChildren: () => import('./modules/activity-reports/activity-reports.module').then(m => m.ActivityReportsModule)
      },
      {
        path: 'invoices',
        loadChildren: () => import('./modules/invoice/invoice.module').then(m => m.InvoiceModule),
        data: {
          breadcrumb: 'invoices'
        },
      },
      {
        path: 'contract-management',
        loadChildren: () => import('./modules/contract-management/contract-management.module').then(m => m.ContractManagementModule),
        data: {
          breadcrumb: 'contract-management'
        },
      },
      {
        path: 'expenses',
        loadChildren: () => import('./modules/expenses/expenses.module').then(m => m.ExpensesModule)
      },
      {
        path: 'human-ressources',
        loadChildren: () => import('./modules/human-ressources/human-ressources.module').then(m => m.HumanRessourcesModule)
      },
      {
        path: 'placements',
        loadChildren: () => import('@shared/modules/placement/placement.module').then(m => m.PlacementModule)
      },
      {
        path: 'recruitment',
        loadChildren: () => import('./modules/recruitment/recruitment.module').then(m => m.RecruitmentModule)
      },
      {
        path: 'settings',
        data: {
          breadcrumb: 'settings'
        },
        loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'user',
        data: {
          breadcrumb: 'user'
        },
        loadChildren: () => import('@shared/components/settings/user.module').then(m => m.UserModule)
      },
      {
        path: 'resume',
        loadChildren: () => import('./modules/resume/resume.module').then(m => m.ResumeModule),
      },
      {
        path: 'linkedin',
        component: ShareOnLinkedinComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
