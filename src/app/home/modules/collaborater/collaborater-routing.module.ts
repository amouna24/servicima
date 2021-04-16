import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CollaboraterComponent } from './collaborater.component';
import { TimesheetsListComponent } from './modules/timesheet/timesheets-list/timesheets-list.component';

const routes: Routes = [
  {
    path: '',
    // component: CollaboraterComponent,
    component: TimesheetsListComponent,
    children: [
      {
        path: 'annual-interviews',
        loadChildren: () => import('./modules/annual-interviews/annual-interviews.module').then(m => m.AnnualInterviewsModule)
      },
      {
        path: 'expatriation-certificates',
        loadChildren: () =>
          import('./modules/expatriation-certificates/expatriation-certificates.module').then(m => m.ExpatriationCertificatesModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./modules/expenses/expenses.module').then(m => m.ExpensesModule)
      },
      {
        path: 'hr-records',
        loadChildren: () => import('./modules/hr-records/hr-records.module').then(m => m.HrRecordsModule)
      },
      {
        path: 'salary-slips',
        loadChildren: () => import('./modules/salary-slips/salary-slips.module').then(m => m.SalarySlipsModule)
      },
      {
        path: 'timesheet',
        loadChildren: () => import('./modules/timesheet/timesheet.module').then(m => m.TimesheetModule)
      },

      {
        path: 'training',
        loadChildren: () => import('./modules/training/training.module').then(m => m.TrainingModule)
      },
      {
        path: 'work-certificates',
        loadChildren: () => import('./modules/work-certificates/work-certificates.module').then(m => m.WorkCertificatesModule)
      },
      {
        path: 'placements',
        loadChildren: () => import('@shared/modules/placement/placement.module').then(m => m.PlacementModule)
      },
      {
        path: 'cv',
        loadChildren: () => import('@shared/modules/cv/cv.module').then(m => m.CvModule)
      },
      {
        path: 'user',
        data: {
          breadcrumb: 'user'
        },
        loadChildren: () => import('@shared/components/settings/user.module').then(m => m.UserModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollaboraterRoutingModule { }
